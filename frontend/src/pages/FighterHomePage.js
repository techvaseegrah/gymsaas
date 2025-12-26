import React, { useState, useEffect } from 'react';
import FighterDashboard from '../components/FighterDashboard';
import EnhancedLevelProgress from '../components/EnhancedLevelProgress';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaCrown, FaIdCard } from 'react-icons/fa';
import ProfilePhotoModal from '../components/ProfilePhotoModal';

const FighterHomePage = ({ user, confirmLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [fighterData, setFighterData] = useState(null);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [pressTimer, setPressTimer] = useState(null);
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

    const handleLongPressStart = () => {
        const timer = setTimeout(() => {
            setIsPhotoModalOpen(true);
        }, 500);
        setPressTimer(timer);
    };

    const handleLongPressEnd = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            setPressTimer(null);
        }
    };

    const renderContent = () => {
        if (activeTab === 'dashboard') {
            return <FighterDashboard user={user} fighterData={fighterData} confirmLogout={confirmLogout} />;
        }
        if (activeTab === 'membership') {
            return <EnhancedLevelProgress fighterData={fighterData || user} />;
        }
        return null;
    };

    return (
        <div className="min-h-screen relative bg-gray-900 border-b-4 border-white rounded-3xl pb-10 overflow-x-hidden text-gray-200 font-sans selection:bg-red-500 selection:text-white">
            
            {/* --- ANIMATED BACKGROUND BLOBS --- */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                 <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-3xl mix-blend-screen filter blur-[128px] opacity-20 animate-blob"></div>
                 <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-3xl mix-blend-screen filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
                 <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-600 rounded-3xl mix-blend-screen filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* --- GLASS HERO HEADER --- */}
            <div className="relative z-10 glass-panel rounded-b-[3rem] p-6 md:p-12 mb-8 border-t-0 border-x-0">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left animate-fade-in w-full md:w-auto">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-sm">
                            Welcome, <span className="text-red-500 block md:inline">{user?.name || 'Fighter'}</span>
                        </h2>
                        <p className="text-gray-300 mt-2 text-sm md:text-lg font-light tracking-wide">
                            Train hard. Fight easy. This is your command center.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                            <span className="px-3 py-1 md:px-4 md:py-1.5 bg-red-500/20 border border-red-500/30 text-red-200 rounded-2xl text-xs md:text-sm font-medium backdrop-blur-md">
                                Fighter Portal
                            </span>
                            <span className="px-3 py-1 md:px-4 md:py-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 rounded-2xl text-xs md:text-sm font-medium backdrop-blur-md">
                                Level {fighterData?.assessment?.specialGradeScore || 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Glass Profile Photo Card */}
                    {fighterData && (
                        <div className="relative group mt-4 md:mt-0">
                            <div 
                                className="w-24 h-24 md:w-36 md:h-36 rounded-3xl p-1 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-md shadow-2xl cursor-pointer"
                                onTouchStart={handleLongPressStart}
                                onTouchEnd={handleLongPressEnd}
                                onTouchCancel={handleLongPressEnd}
                                onMouseDown={handleLongPressStart}
                                onMouseUp={handleLongPressEnd}
                                onMouseLeave={handleLongPressEnd}
                            >
                                <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-black/50 relative z-10">
                                    {fighterData.profilePhoto ? (
                                        <img 
                                            src={fighterData.profilePhoto} 
                                            alt={fighterData.name} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-3xl"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-800 rounded-3xl">
                                            <span className="text-xs">No Photo</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => navigate('/fighter/profile/update')}
                                className="absolute bottom-0 right-0 md:bottom-1 md:right-1 bg-red-600/90 hover:bg-red-500 text-white p-2 md:p-2.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-transform transform group-hover:scale-110 z-20"
                                title="Update Profile"
                            >
                                <FaUserEdit className="text-sm md:text-base" />
                            </button>
                            <div className="absolute top-2 right-2 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-2 border-gray-900 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse z-20"></div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="relative z-10 max-w-6xl mx-auto px-4">
                
                {/* --- RESPONSIVE GLASS TABS --- */}
                <div className="flex justify-center mb-10 w-full">
                    <div className="bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-lg flex w-full max-w-md md:w-auto md:min-w-[400px]">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 ${
                                activeTab === 'dashboard'
                                    ? 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg shadow-red-900/50 ring-1 ring-white/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <FaIdCard className="text-base md:text-lg" /> Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('membership')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 ${
                                activeTab === 'membership'
                                    ? 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg shadow-red-900/50 ring-1 ring-white/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <FaCrown className="text-base md:text-lg" /> Membership
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="animate-fade-in-up">
                    {renderContent()}
                </div>
            </div>
            
            <ProfilePhotoModal 
                isOpen={isPhotoModalOpen}
                onClose={() => setIsPhotoModalOpen(false)}
                profilePhoto={fighterData?.profilePhoto}
                fighterName={fighterData?.name}
            />

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    );
};

export default FighterHomePage;