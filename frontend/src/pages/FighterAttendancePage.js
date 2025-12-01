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
    
    // New Date Filter State (Empty by default to show ALL records)
    const [selectedDate, setSelectedDate] = useState(''); 

    const navigate = useNavigate();
    const [isRfidModalOpen, setIsRfidModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState(null);

    // Fetch attendance (Triggered on load AND when date changes)
    const fetchAndProcessAttendance = async () => {
        setLoading(true);
        try {
            // Append date query if a date is selected
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
    }, [selectedDate]); // Re-run when date changes

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
                        enableHighAccuracy: true,
                        timeout: 10000, // Reduced timeout to 10s
                        maximumAge: 0
                    }
                );
            }
        });
    };

    const handlePunch = async (e) => {
        if (e) e.preventDefault(); // Prevent any default form submission
        
        console.log("Punch initiated...");
        setPunching(true);
        setMessage('Acquiring Location...'); // Immediate feedback
        
        try {
            let location = null;
            
            try {
                // Check if we are in a secure context (HTTPS or localhost)
                if (window.isSecureContext === false) {
                    console.warn("Geolocation requires HTTPS. Skipping location.");
                    // We skip the location call to prevent the browser from blocking/hanging
                } else {
                    const position = await getPreciseLocation();
                    const { latitude, longitude, accuracy } = position.coords;
                    console.log("Location acquired:", latitude, longitude);
                    location = { latitude, longitude };

                    if (accuracy > 1000) {
                        // Use a non-blocking notification or just log it, 
                        // blocking with window.confirm can be problematic on some touch devices
                        console.warn('GPS signal is weak.');
                    }
                }
            } catch (error) {
                console.warn("Location error:", error);
                // Proceed without location rather than stopping
                location = null;
            }
            
            setMessage('Sending Punch...');
            const { data } = await api.post('/attendance/punch', { location });
            console.log("Punch response:", data);
            
            setMessage(data.msg); 
            await fetchAndProcessAttendance();
            
        } catch (err) {
            console.error("Punch API Error:", err);
            const errorMsg = err.response?.data?.msg || 'An error occurred during punch.';
            
            if (errorMsg.includes('subscription has expired')) {
                setShowSubscriptionAlert(true);
            } else {
                setMessage(`Error: ${errorMsg}`);
            }
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
            if (errorMsg.includes('subscription has expired')) {
                setShowSubscriptionAlert(true);
            } else {
                setMessage(`Error: ${errorMsg}`);
            }
            setIsRfidModalOpen(false);
        } finally {
            setPunching(false);
        }
    };

    const handleConfirmPunch = async () => {
        setIsConfirmModalOpen(false);
        await handlePunch();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 lg:p-8">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-700 pb-4 gap-4">
                <h1 className="text-3xl font-bold text-white">My Attendance</h1>
                
                {/* --- DATE FILTER --- */}
                <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg border border-gray-600">
                    <FaCalendarAlt className="text-gray-400 ml-2" />
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-white border-none outline-none text-sm font-medium"
                        placeholder="Filter by Date"
                    />
                    {/* Clear Button */}
                    {selectedDate && (
                        <button 
                            onClick={() => setSelectedDate('')}
                            className="text-gray-400 hover:text-white p-1"
                            title="Clear Date Filter"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>
            </div>

            {/* Subscription Alert Modal */}
            {showSubscriptionAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-red-500/30 shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaExclamationTriangle className="text-red-400 text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Subscription Expired</h3>
                            <p className="text-gray-300 mb-6">
                                Your subscription has expired. Please renew your membership to continue using the attendance system.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => setShowSubscriptionAlert(false)}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSubscriptionAlert(false);
                                        navigate('/fighter');
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all"
                                >
                                    View Membership
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Punch In/Out Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-2xl p-6 mb-8 border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <FaIdCard className="mr-3 text-red-400" />
                    Record Your Attendance
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setIsRfidModalOpen(true)}
                        className="w-full sm:w-auto bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm shadow-lg"
                    >
                        <FaIdCard className="mr-2" />
                        RFID PUNCH
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/fighter/attendance/face')}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm shadow-lg"
                    >
                        <FaCamera className="mr-2" />
                        FACE PUNCH
                    </button>
                    
                    <button
                        type="button"
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
                <div className="p-6 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white flex items-center">
                        <FaClock className="mr-3 text-red-400" />
                        {selectedDate ? `Records for ${selectedDate}` : 'Overall History'}
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="text-center p-8">
                            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-gray-400">Loading...</p>
                        </div>
                    ) : (
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
                                        const regularCheckIns = day.checkIns ? day.checkIns.filter(p => !p.late) : [];
                                        const allCheckOuts = day.checkOuts ? [...(day.checkIns ? day.checkIns.filter(p => p.late) : []), ...day.checkOuts] : [];

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
                                                    {day.duration || "00:00:00"}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                                            No attendance records found {selectedDate ? `for ${selectedDate}` : ''}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
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