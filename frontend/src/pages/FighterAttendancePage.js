import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaClock, FaIdCard, FaCamera, FaExclamationTriangle, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RFIDPunchModal from '../components/RFIDPunchModal';
import AttendanceConfirmationModal from '../components/AttendanceConfirmationModal';

const FighterAttendancePage = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [punching, setPunching] = useState(false);
    const [message, setMessage] = useState('');
    const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);
    
    // Default to TODAY
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const navigate = useNavigate();
    const [isRfidModalOpen, setIsRfidModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState(null);

    const fetchAndProcessAttendance = async () => {
        setLoading(true);
        try {
            const url = selectedDate ? `/attendance/me?date=${selectedDate}` : '/attendance/me';
            const { data } = await api.get(url);
            setAttendance(data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            setMessage('Failed to load attendance data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndProcessAttendance();
    }, [selectedDate]);

    const getPreciseLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
            } else {
                navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
            }
        });
    };

    const handlePunch = async (e) => {
        if (e) e.preventDefault();
        setPunching(true);
        setMessage('Acquiring Location...');
        
        try {
            let location = null;
            try {
                if (window.isSecureContext !== false) {
                    const position = await getPreciseLocation();
                    location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                }
            } catch (error) { console.warn("Location error:", error); }
            
            setMessage('Sending Punch...');
            const { data } = await api.post('/attendance/punch', { location });
            setMessage(data.msg); 
            await fetchAndProcessAttendance();
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'An error occurred.';
            if (errorMsg.includes('subscription has expired')) setShowSubscriptionAlert(true);
            else setMessage(`Error: ${errorMsg}`);
        } finally {
            setPunching(false);
        }
    };

    const handleRfidSubmit = async (rfid, location) => {
        setPunching(true);
        try {
            // Change from POST /attendance/rfid-status to GET /attendance/status/:rfid
            const { data } = await api.get(`/attendance/status/${rfid}`);
            setConfirmModalData({...data, location}); // Pass location to confirmation modal
            setIsRfidModalOpen(false);
            setIsConfirmModalOpen(true);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'An error occurred.';
            if (errorMsg.includes('subscription has expired')) setShowSubscriptionAlert(true);
            else setMessage(`Error: ${errorMsg}`);
            setIsRfidModalOpen(false);
        } finally { setPunching(false); }
    };

    const handleConfirmPunch = async () => {
        setIsConfirmModalOpen(false);
        await handlePunch();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-700 pb-4 gap-4">
                <h1 className="text-3xl font-bold text-white">My Attendance</h1>
                
                {/* --- DATE FILTER (FIXED VISIBILITY) --- */}
                <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg border border-gray-600 shadow-lg">
                    <span className="text-gray-400 text-sm font-medium ml-2">Date:</span>
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        // FIXED: colorScheme: 'dark' makes the calendar icon WHITE
                        style={{ colorScheme: 'dark' }}
                        className="bg-transparent text-white border-none outline-none text-sm font-bold cursor-pointer"
                    />
                    <button 
                        onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition border border-gray-600"
                    >
                        Today
                    </button>
                </div>
            </div>

            {/* Subscription Alert */}
            {showSubscriptionAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl border border-red-500/30 p-6 max-w-md w-full text-center">
                        <FaExclamationTriangle className="text-red-400 text-3xl mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Subscription Expired</h3>
                        <p className="text-gray-300 mb-6">Please renew your membership.</p>
                        <button onClick={() => setShowSubscriptionAlert(false)} className="bg-gray-700 text-white px-4 py-2 rounded">Close</button>
                    </div>
                </div>
            )}

            {/* Punch Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-2xl p-6 mb-8 border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <FaIdCard className="mr-3 text-red-400" /> Record Attendance
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button onClick={() => setIsRfidModalOpen(true)} className="w-full sm:w-auto bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2">
                        <FaIdCard /> RFID PUNCH
                    </button>
                    <button onClick={() => navigate('/fighter/attendance/face')} className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2">
                        <FaCamera /> FACE PUNCH
                    </button>
                    <button onClick={handlePunch} disabled={punching} className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                        <FaClock /> {punching ? 'PUNCHING...' : 'QUICK PUNCH'}
                    </button>
                </div>
                {message && <p className={`mt-4 text-center p-2 rounded ${message.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>{message}</p>}
            </div>

            {/* History Table */}
            <div className="bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-white">
                        {selectedDate === new Date().toISOString().split('T')[0] ? "Today's Activity" : `Records for ${new Date(selectedDate).toLocaleDateString()}`}
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> : (
                        <table className="min-w-full divide-y divide-gray-700">                  
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Check-Ins</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Check-Outs</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {attendance.length > 0 ? attendance.map((day) => (
                                    <tr key={day.id || day.date} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 text-sm text-white">{new Date(day.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {day.checkIns?.filter(p => !p.late).map((p, i) => <span key={i} className="text-green-400 mr-2">{new Date(p.time).toLocaleTimeString()}</span>)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {[...(day.checkIns?.filter(p => p.late) || []), ...(day.checkOuts || [])].map((p, i) => (
                                                <span key={i} className="text-red-400 mr-2">{new Date(p.time).toLocaleTimeString()}</span>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-white">{day.duration}</td>
                                    </tr>
                                )) : <tr><td colSpan="4" className="p-8 text-center text-gray-500">No records found.</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            {isRfidModalOpen && <RFIDPunchModal isOpen={isRfidModalOpen} onClose={() => setIsRfidModalOpen(false)} onSubmit={handleRfidSubmit} loading={punching} />}
            {isConfirmModalOpen && confirmModalData && <AttendanceConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleConfirmPunch} data={confirmModalData} />}
        </div>
    );
};

export default FighterAttendancePage;