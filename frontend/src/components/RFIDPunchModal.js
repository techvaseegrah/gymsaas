import React, { useState } from 'react';
import { FaIdCard, FaTimes, FaSpinner } from 'react-icons/fa';

const RFIDPunchModal = ({ isOpen, onClose, onSubmit, loading }) => {
    const [rfid, setRfid] = useState('');
    const [locationError, setLocationError] = useState('');

    if (!isOpen) return null;

    const getLocation = async () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            return null;
        }

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

            return {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
        } catch (error) {
            let errorMessage = '';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied. Please enable location permissions for this site.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable. Please check your device settings.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out. Please try again.';
                    break;
                default:
                    errorMessage = `Unknown location error: ${error.message}`;
                    break;
            }
            setLocationError(errorMessage);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rfid) {
            // Get location before submitting
            setLocationError('');
            const userLocation = await getLocation();
            
            if (!userLocation && !locationError) {
                // If we couldn't get location but there's no explicit error, still proceed
                // but show a warning
                setLocationError('Could not get your location. Attendance will be marked without location verification.');
            }
            
            // Submit with location data
            onSubmit(rfid, userLocation);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-700">
                <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                    <h3 className="text-xl font-semibold text-white flex items-center">
                        <FaIdCard className="mr-3 text-yellow-500" />
                        Enter Your RFID
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <p className="text-gray-300 mb-4">Please enter your RFID code below to check your attendance status.</p>
                    <input
                        type="text"
                        value={rfid}
                        onChange={(e) => setRfid(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                        placeholder="RFID Code"
                        autoFocus
                    />
                    
                    {locationError && (
                        <div className="mt-3 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg">
                            <p className="text-red-300 text-sm">{locationError}</p>
                        </div>
                    )}
                    
                    <div className="flex justify-end mt-6 space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!rfid || loading}
                            className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-800 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-900 disabled:from-yellow-800 disabled:to-yellow-900 flex items-center transition-all duration-200"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Checking...
                                </>
                            ) : 'Check Status'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RFIDPunchModal;