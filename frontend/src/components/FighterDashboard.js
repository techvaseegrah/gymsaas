import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const FighterDashboard = ({ user, fighterData }) => {
    const [loading, setLoading] = useState(!fighterData);
    const navigate = useNavigate();

    useEffect(() => {
        if (fighterData) {
            setLoading(false);
        }
    }, [fighterData]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-xl font-semibold">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!fighterData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center rounded-2xl">
                <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
                    <h1 className="text-3xl font-bold text-red-400 mb-4">Profile Not Found</h1>
                    <p className="text-gray-300 mb-6">Please contact the administrator for assistance.</p>
                    <button 
                        onClick={handleLogout}
                        className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    // Function to get a random motivational quote
    const getMotivationalQuote = () => {
        const quotes = [
            "Champions aren't made in gyms. Champions are made from something deep inside them.",
            "The only bad workout is the one that didn't happen.",
            "Success isn't always about greatness. It's about consistency.",
            "Your body can do it—it's your mind you need to convince.",
            "Don't stop when you're tired. Stop when you're done."
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8 rounded-2xl">
            <div className="max-w-6xl mx-auto">
                {/* Header with motivational quote */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 shadow-2xl border border-gray-700 transform transition-all duration-300 hover:scale-[1.01]">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Welcome, {fighterData.name}!
                            </h1>
                            <p className="text-gray-400 text-lg">Here's your fighter dashboard</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button 
                                onClick={() => navigate('/fighter/profile/update')}
                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg shadow-md hover:from-red-700 hover:to-red-900 transition-all duration-300 transform hover:scale-105"
                            >
                                Update Profile
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg border-l-4 border-red-500">
                        <p className="text-gray-300 italic text-center">"{getMotivationalQuote()}"</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-5 text-white shadow-lg transform transition-all duration-300 hover:scale-105 border border-blue-700">
                        <div className="text-3xl font-bold">{fighterData.fighterBatchNo || 'N/A'}</div>
                        <div className="text-blue-300">Batch Number</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-5 text-white shadow-lg transform transition-all duration-300 hover:scale-105 border border-green-700">
                        <div className="text-3xl font-bold">{fighterData.age || 'N/A'}</div>
                        <div className="text-green-300">Age</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-5 text-white shadow-lg transform transition-all duration-300 hover:scale-105 border border-purple-700">
                        <div className="text-3xl font-bold">{fighterData.height || 'N/A'}</div>
                        <div className="text-purple-300">Height</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-xl p-5 text-white shadow-lg transform transition-all duration-300 hover:scale-105 border border-red-700">
                        <div className="text-3xl font-bold">{fighterData.weight || 'N/A'}</div>
                        <div className="text-red-300">Weight</div>
                    </div>
                </div>

                {/* Personal Info Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-700 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white pb-2 border-b-2 border-blue-500">Personal Info</h2>
                        <span className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm font-semibold">Basic Details</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300">
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-blue-500 transform hover:scale-105">
                            <strong className="text-blue-400">NAME:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.name}</p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-blue-500 transform hover:scale-105">
                            <strong className="text-blue-400">FIGHTER BATCH NO:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.fighterBatchNo}</p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-blue-500 transform hover:scale-105">
                            <strong className="text-blue-400">RFID:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.rfid}</p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-blue-500 transform hover:scale-105">
                            <strong className="text-blue-400">Age:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.age}</p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-blue-500 transform hover:scale-105">
                            <strong className="text-blue-400">Gender:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.gender}</p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-blue-500 transform hover:scale-105">
                            <strong className="text-blue-400">Ph No:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.phNo}</p>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-blue-500 transform hover:scale-105">
                            <strong className="text-blue-400">Address:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.address}</p>
                        </div>
                    </div>
                </div>

                {/* Fighter Details Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-700 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white pb-2 border-b-2 border-green-500">Fighter Details</h2>
                        <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm font-semibold">Physical Stats</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300">
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-green-500 transform hover:scale-105">
                            <strong className="text-green-400">Height:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.height}</p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-green-500 transform hover:scale-105">
                            <strong className="text-green-400">Weight:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.weight}</p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-green-500 transform hover:scale-105">
                            <strong className="text-green-400">Blood group:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.bloodGroup}</p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-green-500 transform hover:scale-105">
                            <strong className="text-green-400">Occupation:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.occupation}</p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-green-500 transform hover:scale-105">
                            <strong className="text-green-400">Date of Joining:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{new Date(fighterData.dateOfJoining).toLocaleDateString()}</p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-green-500 transform hover:scale-105">
                            <strong className="text-green-400">Package:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.package}</p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-green-500 transform hover:scale-105">
                            <strong className="text-green-400">Previous Experience:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.previousExperience}</p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-green-500 transform hover:scale-105">
                            <strong className="text-green-400">Medical Issue/ Injury:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.medicalIssue}</p>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-green-500 transform hover:scale-105">
                            <strong className="text-green-400">Motto:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.motto}</p>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-green-500 transform hover:scale-105">
                            <strong className="text-green-400">Martial Arts Knowledge:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.martialArtsKnowledge}</p>
                        </div>
                    </div>
                </div>

                {/* Goals & Referral Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-700 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white pb-2 border-b-2 border-purple-500">Goals & Referral</h2>
                        <span className="px-3 py-1 bg-purple-900 text-purple-300 rounded-full text-sm font-semibold">Motivation</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-purple-500 transform hover:scale-105">
                            <strong className="text-purple-400">Goals:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">
                                {fighterData.goals?.length > 0 ? fighterData.goals.join(', ') : 'None specified'}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border-l-4 border-purple-500 transform hover:scale-105">
                            <strong className="text-purple-400">How did u know about us?:</strong> 
                            <p className="text-lg font-semibold mt-1 text-white">{fighterData.referral || 'Not specified'}</p>
                        </div>
                        {/* Achievements */}
                        {fighterData.achievements && (
                            <div className="md:col-span-2 p-4 bg-gradient-to-r from-yellow-900 to-amber-900 rounded-lg border-l-4 border-yellow-500 transform hover:scale-105">
                                <div className="flex items-start">
                                    <div className="mr-3 text-yellow-400 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <strong className="text-yellow-300">Achievements:</strong> 
                                        <p className="text-lg font-semibold mt-1 text-white">{fighterData.achievements}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FighterDashboard;