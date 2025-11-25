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
    const [selectedDate, setSelectedDate] = useState(''); // Date Filter
    const navigate = useNavigate();
    const [isRfidModalOpen, setIsRfidModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState(null);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const url = selectedDate ? `/attendance/me?date=${selectedDate}` : '/attendance/me';
            const { data } = await api.get(url);
            setAttendance(data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedDate]);

    // ... (Keep getPreciseLocation, handlePunch, handleRfidSubmit, handleConfirmPunch logic same as before) ...
    // For brevity, I'm assuming you copy those helper functions from your previous file or the last response I gave.
    // They logic hasn't changed, only the Render below has changed.

    const handlePunch = async () => { /* ... Insert handlePunch logic ... */ };
    const handleRfidSubmit = async (rfid, loc) => { /* ... Insert logic ... */ };
    const handleConfirmPunch = async () => { /* ... Insert logic ... */ };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold text-white">My Attendance</h1>
                
                {/* DATE PICKER */}
                <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg border border-gray-600">
                    <FaCalendarAlt className="text-gray-400 ml-2" />
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-white border-none outline-none text-sm font-medium"
                    />
                    {selectedDate && (
                        <button onClick={() => setSelectedDate('')} className="text-gray-400 hover:text-white p-1"><FaTimes /></button>
                    )}
                </div>
            </div>

            {/* Punch Buttons Section (Same as before) */}
            <div className="bg-gray-800 p-6 rounded-2xl mb-8 border border-gray-700 shadow-xl">
                <div className="flex flex-wrap gap-4">
                    <button onClick={() => setIsRfidModalOpen(true)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2"><FaIdCard /> RFID PUNCH</button>
                    <button onClick={() => navigate('/fighter/attendance/face')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2"><FaCamera /> FACE PUNCH</button>
                    <button onClick={handlePunch} disabled={punching} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 disabled:opacity-50"><FaClock /> {punching ? '...' : 'QUICK PUNCH'}</button>
                </div>
                {message && <p className="mt-4 text-center text-white bg-gray-700 p-2 rounded">{message}</p>}
            </div>

            {/* Table */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-white">{selectedDate ? `History: ${selectedDate}` : 'Overall History'}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Check-In</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Check-Out</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {attendance.map((day) => (
                                <tr key={day._id || day.date} className="hover:bg-gray-700/50">
                                    <td className="px-6 py-4 text-sm text-white">{new Date(day.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-green-400 font-mono">
                                        {day.checkIns?.[0]?.time ? new Date(day.checkIns[0].time).toLocaleTimeString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-red-400 font-mono">
                                        {day.checkOuts?.[0]?.time ? new Date(day.checkOuts[0].time).toLocaleTimeString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white font-bold">{day.duration}</td>
                                </tr>
                            ))}
                            {attendance.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No records found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {isRfidModalOpen && <RFIDPunchModal isOpen={isRfidModalOpen} onClose={() => setIsRfidModalOpen(false)} onSubmit={handleRfidSubmit} loading={punching} />}
            {isConfirmModalOpen && <AttendanceConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleConfirmPunch} data={confirmModalData} />}
        </div>
    );
};

export default FighterAttendancePage;