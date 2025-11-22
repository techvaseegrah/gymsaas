import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaClock, FaIdCard, FaCamera, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RFIDPunchModal from '../components/RFIDPunchModal';
import AttendanceConfirmationModal from '../components/AttendanceConfirmationModal';

const FighterAttendancePage = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [punching, setPunching] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [isRfidModalOpen, setIsRfidModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState(null);

    const recalculateDuration = (day) => {
        return day.duration || '00:00:00';
    };

    const fetchAndProcessAttendance = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/attendance/me');
            const processedData = data.map(day => {
                const newDuration = recalculateDuration(day);
                return { ...day, duration: newDuration };
            });
            setAttendance(processedData);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            setMessage('Failed to load attendance data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndProcessAttendance();
    }, []);

    // Helper to get precise location
    const getPreciseLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve(position);
                    },
                    (error) => {
                        reject(error);
                    },
                    {
                        enableHighAccuracy: true, // FORCE GPS
                        timeout: 15000,           // Wait up to 15s for lock
                        maximumAge: 0             // DO NOT use cached position
                    }
                );
            }
        });
    };

    const handlePunch = async () => {
        setPunching(true);
        setMessage('');
        try {
            let location = null;
            
            try {
                const position = await getPreciseLocation();
                const { latitude, longitude, accuracy } = position.coords;
                
                location = { latitude, longitude };

                // Warn user if accuracy is very bad (> 1000 meters) - essentially useless
                if (accuracy > 1000) {
                    const proceed = window.confirm(
                        `GPS signal is very weak (Accuracy: ${Math.round(accuracy)}m). This location data is not reliable enough for attendance verification. ` +
                        `Try these solutions:\n` +
                        `1. Turn on Wi-Fi for better accuracy\n` +
                        `2. Move closer to a window or outdoors\n` +
                        `3. Enable High Accuracy mode in your device settings\n\n` +
                        `Continue anyway? (Attendance may be rejected due to location verification)`
                    );
                    if (!proceed) {
                        setPunching(false);
                        return;
                    }
                } else if (accuracy > 100) {
                    // Warn user if accuracy is bad (> 100 meters but < 1000m)
                    const proceed = window.confirm(
                        `GPS signal is weak (Accuracy: ${Math.round(accuracy)}m). You might be marked as "Too Far". ` +
                        `Try turning on Wi-Fi for better accuracy. Continue anyway?`
                    );
                    if (!proceed) {
                        setPunching(false);
                        return;
                    }
                }
            } catch (error) {
                console.warn("Location error:", error);
                // Show message to user but still allow punch without location
                const proceed = window.confirm(
                    `Could not get precise location. You can still punch attendance, but it may be rejected if location verification is required. Continue anyway?`
                );
                if (!proceed) {
                    setPunching(false);
                    return;
                }
                // Set location to null if we can't get it
                location = null;
            }
            
            // Send punch request
            const { data } = await api.post('/attendance/punch', { location });
            setMessage(data.msg); 
            
            await fetchAndProcessAttendance();
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'An error occurred.';
            setMessage(`Error: ${errorMsg}`);
        } finally {
            setPunching(false);
        }
    };

    const handleRfidSubmit = async (rfid, location) => {
        setPunching(true);
        setMessage('');
        try {
            const { data } = await api.post('/attendance/rfid-status', { rfid, location });
            setConfirmModalData(data);
            setIsRfidModalOpen(false);
            setIsConfirmModalOpen(true);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'An error occurred.';
            setMessage(`Error: ${errorMsg}`);
            setIsRfidModalOpen(false);
        } finally {
            setPunching(false);
        }
    };

    const handleConfirmPunch = async () => {
        setIsConfirmModalOpen(false);
        await handlePunch();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300 text-xl font-semibold">Loading attendance...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-2">My Attendance</h1>

            {/* Punch In/Out Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-2xl p-6 mb-8 border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <FaIdCard className="mr-3 text-red-400" />
                    Record Your Attendance
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                        onClick={() => setIsRfidModalOpen(true)}
                        className="w-full sm:w-auto bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm shadow-lg"
                    >
                        <FaIdCard className="mr-2" />
                        RFID PUNCH
                    </button>
                    <button
                        onClick={() => navigate('/fighter/attendance/face')}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm shadow-lg"
                    >
                        <FaCamera className="mr-2" />
                        FACE PUNCH
                    </button>
                    
                    {/* Manual Punch Button (if face/rfid not used) - Optional */}
                    <button
                        onClick={handlePunch}
                        disabled={punching}
                        className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm shadow-lg disabled:opacity-50"
                    >
                        <FaClock className="mr-2" />
                        {punching ? 'PUNCHING...' : 'QUICK PUNCH'}
                    </button>
                </div>
                {message && (
                    <p className={`mt-6 text-center text-sm font-medium p-3 rounded-lg ${message.includes('Error') || message.includes('too far') ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                        {message}
                    </p>
                )}
            </div>

            {/* Attendance History Table */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-2xl overflow-hidden border border-gray-700">
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-white flex items-center">
                        <FaClock className="mr-3 text-red-400" />
                        Attendance History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">                  
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Check-Ins</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Check-Outs</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                            </tr>
                        </thead>
                     
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {attendance.length > 0 ? (
                                attendance.map((day) => {
                                    const regularCheckIns = day.checkIns.filter(p => !p.late);
                                    const allCheckOuts = [...day.checkIns.filter(p => p.late), ...day.checkOuts];

                                    return (
                                        <tr key={day.id || day.date} className="hover:bg-gray-750 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                {(() => {
                                                    const date = new Date(day.date);
                                                    const d = String(date.getDate()).padStart(2, '0');
                                                    const m = String(date.getMonth() + 1).padStart(2, '0');
                                                    const y = date.getFullYear().toString().slice(-2);
                                                    return `${d}/${m}/${y}`;
                                                })()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {regularCheckIns.map((punch, index) => (
                                                    <span key={index} className="block text-green-400 bg-green-900 bg-opacity-30 px-2 py-1 rounded mb-1 w-max">
                                                        {new Date(punch.time).toLocaleTimeString()}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="px-5 py-3 whitespace-nowrap text-sm">
                                                {allCheckOuts.map((punch, index) => (
                                                    <div key={index} className={`flex items-center gap-2 px-2 py-1 rounded w-max mb-1 ${punch.late ? 'bg-yellow-900 bg-opacity-30 text-yellow-300' : 'bg-red-900 bg-opacity-30 text-red-400'}`}>
                                                        <span>{new Date(punch.time).toLocaleTimeString()}</span>
                                                        {punch.late && <FaExclamationTriangle title="Late Check-out" />}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                                                {day.duration}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">No attendance records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isRfidModalOpen && (
                <RFIDPunchModal
                    isOpen={isRfidModalOpen}
                    onClose={() => setIsRfidModalOpen(false)}
                    onSubmit={handleRfidSubmit}
                    loading={punching}
                />
            )}

            {isConfirmModalOpen && confirmModalData && (
                <AttendanceConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmPunch}
                    data={confirmModalData}
                />
            )}
        </div>
    );
};

export default FighterAttendancePage;