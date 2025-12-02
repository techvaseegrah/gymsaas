import React, { useState, useEffect } from 'react';
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
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500/50 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300 text-lg font-light tracking-widest animate-pulse">SYNCING DATA...</p>
                </div>
            </div>
        );
    }

    if (!fighterData) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
                <div className="glass-panel rounded-3xl p-10 max-w-md w-full">
                    <h1 className="text-3xl font-bold text-red-400 mb-4">Profile Not Found</h1>
                    <p className="text-gray-300 mb-8 font-light">Please contact the administrator to initialize your fighter profile.</p>
                    <button 
                        onClick={handleLogout}
                        className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/30 transition-all duration-300"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    const getMotivationalQuote = () => {
        const quotes = [
            "Champions aren't made in gyms. Champions are made from something deep inside them.",
            "The only bad workout is the one that didn't happen.",
            "Success isn't always about greatness. It's about consistency.",
            "Your body can do it—it's your mind you need to convince.",
            "Don't stop when you're tired. Stop when you're done.",
            "Discipline is doing what needs to be done, even if you don't want to do it."
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    };

    return (
        <div className="space-y-8">
            {/* Daily Motivation Card */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group flex flex-col justify-center items-center text-center">
                <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-10 -translate-y-10">
                    <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM7 8c0-1.66 1.34-3 3-3v6c-1.66 0-3-1.34-3-3zm10 0c-1.66 0-3 1.34-3 3V5c1.66 0 3 1.34 3 3z"/></svg>
                </div>
                
                <div className="relative z-10 max-w-3xl mx-auto py-2">
                    <h3 className="text-red-400 font-bold text-xs tracking-[0.2em] uppercase mb-4 animate-pulse">Daily Focus</h3>
                    <p className="text-2xl md:text-3xl text-white font-serif italic leading-relaxed text-shadow-sm">
                        "{getMotivationalQuote()}"
                    </p>
                </div>
            </div>

            {/* Stats Overview - REPLACED BATCH NO WITH RFID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'RFID', value: fighterData.rfid, color: 'blue' },
                    { label: 'Age', value: fighterData.age, color: 'green' },
                    { label: 'Height', value: fighterData.height, color: 'purple' },
                    { label: 'Weight', value: fighterData.weight, color: 'red' }
                ].map((stat, index) => (
                    <div key={index} className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1
                        ${stat.color === 'blue' ? 'bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20' : ''}
                        ${stat.color === 'green' ? 'bg-green-600/10 border-green-500/20 hover:bg-green-600/20' : ''}
                        ${stat.color === 'purple' ? 'bg-purple-600/10 border-purple-500/20 hover:bg-purple-600/20' : ''}
                        ${stat.color === 'red' ? 'bg-red-600/10 border-red-500/20 hover:bg-red-600/20' : ''}
                        backdrop-blur-md`}>
                        <div className="relative z-10">
                            {/* Adjusted font size for RFID since it might be longer than 2 digits */}
                            <div className={`${stat.label === 'RFID' ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'} font-black text-white mb-1 truncate`}>
                                {stat.value || 'N/A'}
                            </div>
                            <div className={`text-xs font-bold uppercase tracking-wider
                                ${stat.color === 'blue' ? 'text-blue-400' : ''}
                                ${stat.color === 'green' ? 'text-green-400' : ''}
                                ${stat.color === 'purple' ? 'text-purple-400' : ''}
                                ${stat.color === 'red' ? 'text-red-400' : ''}
                            `}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Personal Info Card - SWAPPED RFID FOR BATCH NO */}
            <div className="glass-panel rounded-3xl p-8 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                        Personal Info
                    </h2>
                    <span className="hidden md:block px-4 py-1.5 bg-blue-500/10 text-blue-300 rounded-full text-xs font-bold border border-blue-500/20">BIO DATA</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { label: 'NAME', value: fighterData.name },
                        { label: 'BATCH NO', value: fighterData.fighterBatchNo }, // Moved here
                        { label: 'GENDER', value: fighterData.gender },
                        { label: 'PHONE', value: fighterData.phNo },
                        { label: 'ADDRESS', value: fighterData.address, full: true },
                    ].map((item, i) => (
                        <div key={i} className={`p-5 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors ${item.full ? 'md:col-span-2 lg:col-span-3' : ''}`}>
                            <strong className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-2">{item.label}</strong> 
                            <p className="text-lg text-white font-medium">{item.value || '-'}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fighter Stats Card */}
            <div className="glass-panel rounded-3xl p-8 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                        Fighter Stats
                    </h2>
                    <span className="hidden md:block px-4 py-1.5 bg-green-500/10 text-green-300 rounded-full text-xs font-bold border border-green-500/20">METRICS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { label: 'Blood Group', value: fighterData.bloodGroup },
                        { label: 'Occupation', value: fighterData.occupation },
                        { label: 'Date of Joining', value: fighterData.dateOfJoining ? new Date(fighterData.dateOfJoining).toLocaleDateString() : '-' },
                        { label: 'Package', value: fighterData.package },
                        { label: 'Experience', value: fighterData.previousExperience },
                        { label: 'Medical Issue', value: fighterData.medicalIssue },
                        { label: 'Motto', value: fighterData.motto, full: true },
                        { label: 'Martial Arts Knowledge', value: fighterData.martialArtsKnowledge, full: true },
                    ].map((item, i) => (
                        <div key={i} className={`p-5 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors ${item.full ? 'md:col-span-2 lg:col-span-3' : ''}`}>
                            <strong className="text-xs font-bold text-green-400 uppercase tracking-wider block mb-2">{item.label}</strong> 
                            <p className="text-lg text-white font-medium">{item.value || '-'}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Goals Card */}
            <div className="glass-panel rounded-3xl p-8 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                        Goals & Achievements
                    </h2>
                    <span className="hidden md:block px-4 py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-xs font-bold border border-purple-500/20">VISION</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                        <strong className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-3">My Goals</strong>
                        <p className="text-lg text-white font-medium leading-relaxed">
                            {fighterData.goals?.length > 0 ? fighterData.goals.join(', ') : 'No specific goals set yet.'}
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                        <strong className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-3">Referral Source</strong>
                        <p className="text-lg text-white font-medium">{fighterData.referral || 'Not specified'}</p>
                    </div>
                    
                    {fighterData.achievements && (
                        <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 backdrop-blur-sm">
                            <div className="flex gap-4">
                                <div className="mt-1 p-2 bg-yellow-500/20 rounded-lg text-yellow-400 h-fit">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <strong className="text-sm font-bold text-yellow-400 uppercase tracking-wider block mb-1">Achievements</strong>
                                    <p className="text-lg text-gray-200 font-medium">{fighterData.achievements}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FighterDashboard;