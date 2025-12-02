import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import { FaIdCard, FaCheckCircle, FaCamera, FaUserTag, FaTimes, FaExclamationTriangle, FaCalendarAlt, FaFilter, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as faceapi from 'face-api.js';
import { exportToExcel, exportToPDF, formatAttendanceDataForExport } from '../utils/exportUtils';

const AdminAttendancePage = () => {
    // --- STATE ---
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceMethod, setAttendanceMethod] = useState(null);
    const [records, setRecords] = useState([]);
    const [recordsLoading, setRecordsLoading] = useState(true);
    const [recordsError, setRecordsError] = useState('');
    
    // RFID State
    const [rfid, setRfid] = useState('');
    const [punchStatus, setPunchStatus] = useState(null);
    const [punchLoading, setPunchLoading] = useState(false);
    const [allRfids, setAllRfids] = useState([]);

    // Face Rec State
    const webcamRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [captureInterval, setCaptureInterval] = useState(null);
    const [fighterForPunch, setFighterForPunch] = useState(null); 

    // Report Modal State
    const [showFighterReport, setShowFighterReport] = useState(false);
    const [selectedFighter, setSelectedFighter] = useState(null);
    const [fighterAttendance, setFighterAttendance] = useState([]);
    const [fighterReportLoading, setFighterReportLoading] = useState(false);
    const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });

    // --- EFFECTS ---
    useEffect(() => {
        const loadModels = async () => {
            const LOCAL_URL = process.env.PUBLIC_URL + '/models';
            const CDN_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

            try {
                if (tf.env().flagRegistry.GPGPU) tf.env().set('WEBGL_FORCE_F16_TEXTURES', true);
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(LOCAL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(LOCAL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(LOCAL_URL)
                ]);
                setModelsLoaded(true);
            } catch (error) {
                console.warn("Local models failed, trying CDN...");
                try {
                    await Promise.all([
                        faceapi.nets.ssdMobilenetv1.loadFromUri(CDN_URL),
                        faceapi.nets.faceLandmark68Net.loadFromUri(CDN_URL),
                        faceapi.nets.faceRecognitionNet.loadFromUri(CDN_URL)
                    ]);
                    setModelsLoaded(true);
                } catch (e) { console.error("Models failed to load"); }
            }
        };
        loadModels();
        fetchAllRfids();
    }, []);

    useEffect(() => { fetchAttendanceRecords(); }, [selectedDate]);

    const fetchAttendanceRecords = async () => {
        try {
            setRecordsLoading(true);
            const { data } = await api.get(`/attendance/all?date=${selectedDate}`);
            setRecords(data);
        } catch (err) { setRecordsError('Failed to fetch records.'); } 
        finally { setRecordsLoading(false); }
    };

    const fetchAllRfids = async () => {
        try { const { data } = await api.get('/fighters/rfids'); setAllRfids(data); } catch (e) {}
    };

    // --- LOGIC ---
    const openModal = (method) => {
        setRfid('');
        setPunchStatus(null);
        setFighterForPunch(null);
        setAttendanceMethod(method);
        if (method === 'face') startFaceScan();
    };

    const closeModal = () => {
        stopFaceScan();
        setAttendanceMethod(null);
    };

    const startFaceScan = () => {
        if (captureInterval) return;
        const interval = setInterval(async () => {
            if (webcamRef.current && modelsLoaded) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (!imageSrc) return;
                try {
                    const img = await faceapi.fetchImage(imageSrc);
                    const detections = await faceapi.detectSingleFace(img, new faceapi.SsdMobilenetv1Options({minConfidence:0.6})).withFaceLandmarks().withFaceDescriptor();
                    if (detections) {
                        stopFaceScan();
                        setPunchLoading(true);
                        const { data } = await api.post('/attendance/admin/face-recognition', { faceDescriptor: Array.from(detections.descriptor) });
                        setPunchStatus({ type: 'success', message: data.msg, fighter: data.fighter });
                        fetchAttendanceRecords();
                        setTimeout(closeModal, 3000);
                    }
                } catch (err) { 
                    // Handle API errors specifically
                    if (err.response && err.response.data) {
                        stopFaceScan();
                        setPunchLoading(false);
                        setPunchStatus({ type: 'error', message: err.response.data.msg || "Recognition Error" });
                    }
                }
            }
        }, 1000);
        setCaptureInterval(interval);
    };

    const stopFaceScan = () => { if(captureInterval) { clearInterval(captureInterval); setCaptureInterval(null); } };

    const handleFindFighterByRfid = async (e) => {
        e.preventDefault();
        if(!rfid.trim()) return;
        setPunchLoading(true);
        try {
            const { data } = await api.get(`/attendance/status/${rfid.trim()}`);
            setFighterForPunch(data);
        } catch(err) { setPunchStatus({type:'error', message: err.response?.data?.msg || 'Error'}); }
        finally { setPunchLoading(false); }
    };

    // --- THIS IS THE NEW STEP 2: CONFIRM THE PUNCH ---
    const handlePunchConfirmation = async () => {
        // Add safety check for fighterForPunch
        if (!fighterForPunch || !fighterForPunch.fighter || !fighterForPunch.fighter.rfid) {
            setPunchStatus({type: 'error', message: 'Fighter information is missing'});
            return;
        }

        setPunchLoading(true);
        setPunchStatus(null);
        try {
            // Get location before submitting
            let location = null;
            let locationError = '';
            
            if (navigator.geolocation) {
                try {
                    const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                            (position) => resolve(position),
                            (error) => reject(error),
                            {
                                enableHighAccuracy: true,
                                timeout: 10000,
                                maximumAge: 60000
                            }
                        );
                    });
                    
                    location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                } catch (error) {
                    // Handle location error but don't prevent punching
                    locationError = 'Could not get your location.';
                }
            }

            // Use the original endpoint to record the punch
            const { data } = await api.post('/attendance/admin/rfid', { rfid: fighterForPunch.fighter.rfid, location });
            
            // Show success message with location warning if applicable
            let message = data.msg;
            if (locationError) {
                message += ` Note: ${locationError}`;
            }
            
            // Safely access fighter name
            const fighterName = (data.fighter && data.fighter.name) ? data.fighter.name : 
                              (fighterForPunch.fighter && fighterForPunch.fighter.name) ? fighterForPunch.fighter.name : 
                              'Unknown Fighter';
            
            setPunchStatus({ type: 'success', message, fighter: { name: fighterName } });
            setRfid('');
            fetchAttendanceRecords();
            setTimeout(() => closeModal(), 3000); // Close modal on success
        } catch (err) {
            const message = err.response?.data?.msg || 'An error occurred.';
            setPunchStatus({ type: 'error', message });
        } finally {
            setPunchLoading(false);
            setFighterForPunch(null); // Reset after punch attempt
        }
    };

    const openFighterReport = (name, rec) => {
        let fid = rec.fighterId || (rec.id ? rec.id.split('-')[0] : null);
        if(fid) { setSelectedFighter({name, id: fid}); setShowFighterReport(true); }
    };

    const fetchFighterAttendance = async (id) => {
        setFighterReportLoading(true);
        try {
            let url = `/attendance/fighter/${id}`;
            const params = new URLSearchParams();
            if(dateFilter.startDate && dateFilter.endDate) { params.append('startDate', dateFilter.startDate); params.append('endDate', dateFilter.endDate); }
            if(params.toString()) url += `?${params.toString()}`;
            const {data} = await api.get(url);
            setFighterAttendance(data);
        } catch(e) {} finally { setFighterReportLoading(false); }
    };

    useEffect(() => { if(showFighterReport && selectedFighter) fetchFighterAttendance(selectedFighter.id); }, [dateFilter, showFighterReport, selectedFighter]);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Attendance Management</h2>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-gray-500 text-sm font-medium"><FaCalendarAlt className="inline mr-1"/> Date:</span>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="outline-none text-gray-700 font-bold bg-transparent cursor-pointer" />
                    <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])} className="ml-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full transition font-semibold">Today</button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-700">{selectedDate === new Date().toISOString().split('T')[0] ? "Today's Attendance" : `Attendance for ${selectedDate}`}</h3>
                    <div className="flex gap-4">
                        <button onClick={() => openModal('rfid')} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition shadow-sm"><FaUserTag /> RFID</button>
                        <button onClick={() => openModal('face')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition shadow-sm ${modelsLoaded ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} disabled={!modelsLoaded}><FaCamera /> {modelsLoaded ? 'Face ID' : 'Loading...'}</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {recordsLoading ? <div className="text-center p-12 text-gray-500">Loading...</div> : 
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fighter</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">RFID</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">In</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Out</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Total</th></tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {records.length > 0 ? records.map(r => (
                                <tr key={r.id} className="hover:bg-blue-50">
                                    <td className="px-6 py-4 text-sm font-bold"><button onClick={() => openFighterReport(r.fighterName, r)} className="text-blue-600 hover:underline">{r.fighterName}</button></td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{r.rfid}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm">{r.checkIns.map((p,i)=><div key={i} className="text-green-600 font-bold">{new Date(p.time).toLocaleTimeString()}</div>)}</td>
                                    <td className="px-6 py-4 text-sm">{r.checkOuts.map((p,i)=><div key={i} className="text-red-600 font-bold">{new Date(p.time).toLocaleTimeString()}</div>)}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{r.duration}</td>
                                </tr>
                            )) : <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No records found.</td></tr>}
                        </tbody>
                    </table>}
                </div>
            </div>

            {/* Fighter Report Modal */}
            {showFighterReport && selectedFighter && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">{selectedFighter.name}</h3>
                            <button onClick={() => setShowFighterReport(false)}><FaTimes className="text-gray-500 hover:text-gray-800" /></button>
                        </div>
                        <div className="p-4 border-b bg-white flex gap-4 items-center">
                            <span className="font-medium text-gray-700">Filter:</span>
                            <input type="date" value={dateFilter.startDate} onChange={e=>setDateFilter({...dateFilter, startDate:e.target.value})} className="border p-1 rounded" />
                            <span>-</span>
                            <input type="date" value={dateFilter.endDate} onChange={e=>setDateFilter({...dateFilter, endDate:e.target.value})} className="border p-1 rounded" />
                            <div className="flex gap-2 ml-auto">
                                <button onClick={() => exportToExcel(formatAttendanceDataForExport(fighterAttendance), 'report')} className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold text-sm"><FaFileExcel /> Excel</button>
                                <button onClick={() => exportToPDF(formatAttendanceDataForExport(fighterAttendance), [], 'report')} className="bg-red-100 text-red-700 px-3 py-1 rounded font-bold text-sm"><FaFilePdf /> PDF</button>
                            </div>
                        </div>
                        <div className="flex-grow overflow-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-500">Date</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500">Details</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500">Duration</th></tr></thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {fighterAttendance.map((day,i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm">{new Date(day.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm"><span className="text-green-600">In: {day.checkIns?.map(p=>new Date(p.time).toLocaleTimeString()).join(', ')}</span> <br/> <span className="text-red-600">Out: {day.checkOuts?.map(p=>new Date(p.time).toLocaleTimeString()).join(', ')}</span></td>
                                            <td className="px-6 py-4 text-sm font-bold">{day.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Attendance Modal */}
            {attendanceMethod && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><FaTimes size={20}/></button>
                        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center border-b pb-4">{attendanceMethod==='rfid'?'RFID Punch':'Face Recognition'}</h3>
                        
                        {/* CONDITIONAL RENDERING BASED ON METHOD */}
                        {attendanceMethod === 'rfid' ? (
                            // --- RFID FLOW ---
                            !fighterForPunch ? (
                                <form onSubmit={handleFindFighterByRfid} className="flex flex-col gap-4">
                                    <div className="relative"><FaIdCard className="absolute top-3.5 left-4 text-gray-400"/><input value={rfid} onChange={e=>setRfid(e.target.value)} placeholder="Scan RFID..." className="w-full pl-12 pr-4 py-3 border rounded-lg outline-none" autoFocus/></div>
                                    <button type="submit" className="bg-blue-600 text-white py-3 rounded-lg font-bold" disabled={punchLoading}>Find Fighter</button>
                                </form>
                            ) : (
                                <div className="text-center">
                                    {/* SAFELY ACCESS fighter name with optional chaining and fallback */}
                                    <p className="text-xl font-bold mb-4">{fighterForPunch?.fighter?.name || 'Unknown Fighter'}</p>
                                    <button onClick={handlePunchConfirmation} className={`w-full py-3 rounded-lg font-bold text-white ${fighterForPunch?.nextAction==='in'?'bg-green-600':'bg-red-600'}`} disabled={punchLoading}>
                                        {/* SAFETY CHECK: Use ? to avoid undefined error if data is slow */}
                                        Confirm {fighterForPunch?.nextAction?.toUpperCase() || 'PUNCH'}
                                    </button>
                                </div>
                            )
                        ) : (
                            // --- FACE RECOGNITION FLOW ---
                            <div className="text-center">
                                <div className="relative rounded-lg overflow-hidden border-4 border-gray-200 mb-4 bg-black">
                                    <Webcam ref={webcamRef} className="w-full" screenshotFormat="image/jpeg" />
                                    {punchLoading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold animate-pulse">Processing...</div>}
                                </div>
                                <p className="text-sm text-gray-500">Scanning Face... Auto-confirmation active.</p>
                                {/* REMOVED CONFIRM BUTTON HERE TO FIX THE ERROR */}
                            </div>
                        )}

                        {punchStatus && <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${punchStatus.type==='success'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{punchStatus.type==='success'?<FaCheckCircle/>:<FaExclamationTriangle/>}<div>{punchStatus.message}</div></div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAttendancePage;