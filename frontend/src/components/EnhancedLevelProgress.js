import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaCrown, FaCalendarAlt, FaBolt } from 'react-icons/fa';

const EnhancedLevelProgress = ({ fighterData: propFighterData }) => {
    const [fighterData, setFighterData] = useState(propFighterData || null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Technical skills and advantages for calculations
    const technicalSkills = ['stance', 'jab', 'straight', 'left_hook', 'right_hook', 'thigh_kick', 'rib_kick', 'face_slap_kick', 'inner_kick', 'outer_kick', 'front_kick', 'rise_kick', 'boxing_movements', 'push_ups', 'cambo'];
    const skillAdvantages = ['stamina', 'speed', 'flexibility', 'power', 'martial_arts_knowledge', 'discipline'];

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Fetch Subscription Data
                try {
                    const subRes = await api.get('/subscriptions/me');
                    setSubscription(subRes.data);
                } catch (subErr) {
                    console.warn('Could not fetch subscription', subErr);
                }

                // 2. Fetch Fighter Data if not provided via props
                if (propFighterData) {
                    setFighterData(propFighterData);
                    setLoading(false);
                } else {
                    const res = await api.get('/fighters/me');
                    setFighterData(res.data);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                if (!propFighterData) {
                    if (err.response?.status === 401 || err.response?.status === 403) {
                        setError('Please log in to view your level progress');
                    } else {
                        setError('Failed to load data.');
                    }
                }
                setLoading(false);
            }
        };

        loadData();

        // Polling for fighter stats updates
        const interval = setInterval(async () => {
            if (!propFighterData) {
                try {
                    const res = await api.get('/fighters/me');
                    setFighterData(res.data);
                } catch (e) { console.error("Polling error", e); }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [propFighterData]);

    // --- CALCULATIONS ---
    const calculateLevelProgress = () => {
        if (!fighterData || !fighterData.assessment) {
            return { overallProgress: 0, tribeLevel: 0, technicalProgress: 0, skillProgress: 0, specialGradeScore: 0 };
        }

        const assessment = fighterData.assessment;
        
        // Technical
        let totalTech = 0, maxTech = 0, techCount = 0;
        technicalSkills.forEach(skill => {
            const d = assessment[skill] || {};
            if (parseInt(d.masterScore) > 0) {
                totalTech += parseInt(d.fighterScore) || 0;
                maxTech += parseInt(d.masterScore) || 0;
                techCount++;
            }
        });
        const technicalProgress = maxTech > 0 ? Math.min(100, Math.round((totalTech / maxTech) * 100)) : 0;

        // Skills
        let totalSkill = 0, maxSkill = 0, skillCount = 0;
        skillAdvantages.forEach(skill => {
            const d = assessment[skill] || {};
            if (parseInt(d.masterScore) > 0) {
                totalSkill += parseInt(d.fighterScore) || 0;
                maxSkill += parseInt(d.masterScore) || 0;
                skillCount++;
            }
        });
        const skillProgress = maxSkill > 0 ? Math.min(100, Math.round((totalSkill / maxSkill) * 100)) : 0;

        // Overall
        const overallProgress = (techCount + skillCount) > 0
            ? Math.min(100, Math.round(((technicalProgress * techCount + skillProgress * skillCount) / (techCount + skillCount))))
            : 0;

        const specialGradeScore = parseInt(assessment.specialGradeScore) || 0;
        const tribeLevel = Math.min(100, Math.max(0, specialGradeScore));

        return { overallProgress, tribeLevel, technicalProgress, skillProgress, specialGradeScore };
    };

    const progressData = calculateLevelProgress();
    const isSubExpired = subscription && new Date(subscription.endDate) < new Date();

    // --- RENDER HELPERS (Updated for Glassmorphism) ---
    
    const CircularProgress = ({ percentage, label, size = 120 }) => {
        const strokeWidth = 8;
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (Math.min(100, percentage) / 100) * circumference;
        
        // Color logic
        let colorClass = 'text-green-500';
        if (percentage < 30) colorClass = 'text-red-500';
        else if (percentage < 70) colorClass = 'text-yellow-500';

        return (
            <div className="flex flex-col items-center">
                <div className="relative">
                    <svg width={size} height={size} className="transform -rotate-90 drop-shadow-lg">
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            className="text-white/10" // Dark theme track
                        />
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className={`${colorClass} transition-all duration-1000 ease-out`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white drop-shadow-md">{percentage}%</span>
                    </div>
                </div>
                <span className="mt-3 text-sm font-bold text-gray-300 tracking-wider uppercase">{label}</span>
            </div>
        );
    };

    const AnimatedProgressBar = ({ label, percentage }) => {
        let gradient = 'from-green-400 to-green-600';
        if (percentage < 30) gradient = 'from-red-400 to-red-600';
        else if (percentage < 70) gradient = 'from-yellow-400 to-yellow-600';

        return (
            <div className="mb-5">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-gray-300">{label}</span>
                    <span className="text-sm font-bold text-white">{percentage}%</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-3 backdrop-blur-sm border border-white/5">
                    <div 
                        className={`h-3 rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="glass-panel p-8 rounded-3xl text-center">
                 <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-gray-300 animate-pulse">Analyzing combat data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-panel p-8 rounded-3xl text-center border-red-500/30">
                <p className="text-red-400 font-bold">{error}</p>
            </div>
        );
    }

    if (!fighterData || !fighterData.assessment) {
        return (
            <div className="glass-panel p-10 rounded-3xl text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-white mb-2">No Assessment Data</h3>
                <p className="text-gray-400">Your skills have not been graded yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            
            {/* 1. MEMBERSHIP CARD (New Addition) */}
            {subscription && (
                <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    {/* Background decoration */}
                    <div className="absolute -right-6 -top-6 text-white/5 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                        <FaCrown size={120} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Current Membership</h3>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-bold text-white">{subscription.planName || 'Standard Plan'}</h2>
                                    {isSubExpired ? (
                                        <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded border border-red-500/30">EXPIRED</span>
                                    ) : (
                                        <span className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded border border-green-500/30">ACTIVE</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-yellow-400">₹{subscription.amount}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4 bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                    <FaCalendarAlt />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase font-bold">Expires On</p>
                                    <p className={`text-sm font-bold ${isSubExpired ? 'text-red-400' : 'text-white'}`}>
                                        {new Date(subscription.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                    <FaBolt />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase font-bold">Status</p>
                                    <p className="text-sm font-bold text-white">
                                        {isSubExpired ? 'Renew Now' : `${Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))} Days Left`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. REAL-TIME LEVEL PROGRESS (Dark Theme) */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl">
                <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            Combat Proficiency
                        </h3>
                        <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Real-time Assessment Metrics</p>
                    </div>
                    {/* Special Grade Badge */}
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl border border-blue-400/30 shadow-lg shadow-blue-900/50">
                        <span className="block text-[10px] text-blue-200 uppercase font-bold text-center">Special Grade</span>
                        <span className="block text-2xl font-black text-white text-center">{progressData.specialGradeScore}</span>
                    </div>
                </div>

                {/* Overall Circle */}
                <div className="flex flex-col items-center mb-10">
                    <CircularProgress 
                        percentage={progressData.overallProgress} 
                        label="Overall Fighter Rating" 
                        size={160}
                    />
                </div>

                {/* Bars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <h4 className="font-bold text-blue-300 mb-4 flex items-center text-sm uppercase tracking-wider">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                            Technical Skills
                        </h4>
                        <AnimatedProgressBar 
                            label="Technique Mastery" 
                            percentage={progressData.technicalProgress} 
                        />
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <h4 className="font-bold text-purple-300 mb-4 flex items-center text-sm uppercase tracking-wider">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                            Physical Attributes
                        </h4>
                        <AnimatedProgressBar 
                            label="Athletic Conditioning" 
                            percentage={progressData.skillProgress} 
                        />
                    </div>
                </div>

                {/* Tribe Level */}
                <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-indigo-300 flex items-center text-sm uppercase tracking-wider">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                            Tribe Level
                        </h4>
                        <span className="text-xl font-black text-white">{progressData.tribeLevel}</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-4 border border-white/5">
                        <div 
                            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-1000 ease-out relative overflow-hidden"
                            style={{ width: `${Math.min(100, progressData.tribeLevel)}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedLevelProgress;