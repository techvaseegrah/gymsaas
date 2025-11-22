import React, { useState, useEffect } from 'react';
import FighterDashboard from '../components/FighterDashboard';
import EnhancedLevelProgress from '../components/EnhancedLevelProgress';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaChartLine, FaIdCard } from 'react-icons/fa';
import ProfilePhotoModal from '../components/ProfilePhotoModal'; // Added import

const FighterHomePage = ({ user }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [fighterData, setFighterData] = useState(null);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false); // Added state for modal
    const [pressTimer, setPressTimer] = useState(null); // Added state for long press timer
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFighterData = async () => {
            try {
                const res = await api.get('/fighters/me');
                setFighterData(res.data);
            } catch (err) {
                console.error('Error fetching fighter data:', err);
            }
        };
        fetchFighterData();
    }, []);

    // Function to handle long press start
    const handleLongPressStart = () => {
        const timer = setTimeout(() => {
            setIsPhotoModalOpen(true);
        }, 500); // 500ms delay for long press
        setPressTimer(timer);
    };

    // Function to handle long press end
    const handleLongPressEnd = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            setPressTimer(null);
        }
    };

    const renderContent = () => {
        if (activeTab === 'dashboard') {
            return <FighterDashboard user={user} fighterData={fighterData} />;
        }
        if (activeTab === 'fighterLevel') {
            return <EnhancedLevelProgress fighterData={fighterData || user} />;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-10">
            {/* Hero / Header Section */}
            <div className="bg-gradient-to-r from-gray-900 via-red-900 to-red-800 text-white p-8 md:p-12 rounded-b-3xl shadow-2xl mb-8 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-red-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse"></div>
                </div>
                
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                    <div className="text-center md:text-left animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                            Welcome, <span className="text-yellow-300">{user?.name || 'Fighter'}</span>
                        </h2>
                        <p className="text-gray-300 mt-2 text-lg font-light">
                            Train hard. Fight easy. Here is your command center.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="px-3 py-1 bg-red-800 bg-opacity-50 rounded-full text-sm">Fighter Portal</span>
                            <span className="px-3 py-1 bg-yellow-800 bg-opacity-50 rounded-full text-sm">Level {fighterData?.assessment?.specialGradeScore || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Profile Photo Card */}
                    {fighterData && (
                        <div className="relative group">
                            <div 
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-gray-800 transform transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                // Added touch and mouse events for long press functionality
                                onTouchStart={handleLongPressStart}
                                onTouchEnd={handleLongPressEnd}
                                onTouchCancel={handleLongPressEnd}
                                onMouseDown={handleLongPressStart}
                                onMouseUp={handleLongPressEnd}
                                onMouseLeave={handleLongPressEnd}
                            >
                                {fighterData.profilePhoto ? (
                                    <img 
                                        src={fighterData.profilePhoto} 
                                        alt={fighterData.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900">
                                        <span className="text-xs text-center px-2">No Photo</span>
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => navigate('/fighter/profile/update')}
                                className="absolute bottom-0 right-0 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white p-2 rounded-full shadow-lg transition-transform transform group-hover:scale-110 border-2 border-white"
                                title="Update Profile"
                            >
                                <FaUserEdit />
                            </button>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-4">
                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-1 rounded-xl shadow-lg inline-flex border border-gray-700">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                                activeTab === 'dashboard'
                                    ? 'bg-gradient-to-r from-red-700 to-red-900 text-white shadow-lg transform scale-105'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            <FaIdCard className="text-lg" /> Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('fighterLevel')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                                activeTab === 'fighterLevel'
                                    ? 'bg-gradient-to-r from-red-700 to-red-900 text-white shadow-lg transform scale-105'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            <FaChartLine className="text-lg" /> Real-Time Level
                        </button>
                    </div>
                </div>

                {/* Content Area with Fade-In Animation */}
                <div className="animate-fade-in-up">
                    {renderContent()}
                </div>
            </div>
            
            {/* Profile Photo Modal */}
            <ProfilePhotoModal 
                isOpen={isPhotoModalOpen}
                onClose={() => setIsPhotoModalOpen(false)}
                profilePhoto={fighterData?.profilePhoto}
                fighterName={fighterData?.name}
            />
            
            {/* Custom animations */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default FighterHomePage;