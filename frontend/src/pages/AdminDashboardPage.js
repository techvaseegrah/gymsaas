import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaUsers, FaChartLine, FaMoneyBillWave, FaUserClock, FaArrowUp, FaArrowDown, FaCircle, FaMedal } from 'react-icons/fa';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Using your existing stats endpoint
                const res = await api.get('/fighters/dashboard-stats'); 
                setStats(res.data);
            } catch (err) {
                console.error("Error loading dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex h-screen items-center justify-center text-cyan-500">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
    );

    // --- REUSABLE COMPONENTS ---
    const StatCard = ({ title, value, subtext, icon, color, trend }) => (
        <div className="glass-liquid p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${color}-500/20 rounded-full blur-2xl group-hover:bg-${color}-500/30 transition-all`}></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>{icon}</div>
                    {trend && (
                        <div className={`flex items-center text-xs font-bold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trend > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                <h3 className="text-slate-400 text-sm uppercase tracking-wider font-medium">{title}</h3>
                <p className="text-3xl font-bold text-white mt-1">{value}</p>
                <p className="text-slate-500 text-xs mt-2">{subtext}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8 bg-[#0a0a0a]">
            
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]"></div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Command Center</h1>
                        <p className="text-slate-400 mt-2">Real-time performance metrics and insights.</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            LIVE SYSTEM
                        </div>
                    </div>
                </div>

                {/* 1. KEY METRICS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                        title="Total Fighters" 
                        value={stats.totalFighters} 
                        subtext="Active Roster Size"
                        icon={<FaUsers size={20} />} 
                        color="blue" 
                        trend={12} 
                    />
                    <StatCard 
                        title="Profiles Ready" 
                        value={stats.profileCompleted} 
                        subtext={`${stats.profilePending} Pending Action`}
                        icon={<FaChartLine size={20} />} 
                        color="green" 
                        trend={5}
                    />
                    <StatCard 
                        title="Recent Joins" 
                        value={stats.recentJoinings} 
                        subtext="Last 30 Days"
                        icon={<FaUserClock size={20} />} 
                        color="purple" 
                        trend={18}
                    />
                    <StatCard 
                        title="Graded Fighters" 
                        value={stats.topFighters.length} 
                        subtext="Performance Assessed"
                        icon={<FaMedal size={20} />} 
                        color="yellow" 
                    />
                </div>

                {/* 2. ANALYTICS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* A. Bar Chart: Attendance History (Simulated) */}
                    <div className="lg:col-span-2 glass-liquid p-8 rounded-3xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <FaChartLine className="text-cyan-400" /> Weekly Traffic
                        </h3>
                        <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                            {[45, 62, 38, 75, 55, 80, 65].map((height, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 w-full group cursor-pointer">
                                    <div className="relative w-full bg-slate-800/50 rounded-lg h-full overflow-hidden flex items-end">
                                        <div 
                                            className="w-full bg-gradient-to-t from-cyan-600 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all duration-500 ease-out rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                                            style={{ height: `${height}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono font-bold group-hover:text-white transition-colors">
                                        {['MON','TUE','WED','THU','FRI','SAT','SUN'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* B. Donut Chart: Demographics */}
                    <div className="glass-liquid p-8 rounded-3xl border border-white/10 flex flex-col justify-center relative">
                        <h3 className="text-xl font-bold text-white mb-6 text-center">Demographics</h3>
                        <div className="relative w-56 h-56 mx-auto">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                {/* Background Circle */}
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
                                {/* Male Segment (Blue) */}
                                <circle 
                                    cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="8"
                                    strokeDasharray={`${(stats.genderDistribution.male / stats.totalFighters) * 251} 251`}
                                    strokeDashoffset="0"
                                    transform="rotate(-90 50 50)"
                                    strokeLinecap="round"
                                    className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                                />
                                {/* Female Segment (Pink) */}
                                <circle 
                                    cx="50" cy="50" r="40" fill="none" stroke="#ec4899" strokeWidth="8"
                                    strokeDasharray={`${(stats.genderDistribution.female / stats.totalFighters) * 251} 251`}
                                    strokeDashoffset={`-${(stats.genderDistribution.male / stats.totalFighters) * 251}`}
                                    transform="rotate(-90 50 50)"
                                    strokeLinecap="round"
                                    className="drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-bold text-white tracking-tighter">{stats.totalFighters}</span>
                                <span className="text-xs text-slate-500 uppercase tracking-widest mt-1">Total</span>
                            </div>
                        </div>
                        <div className="flex justify-center gap-6 mt-8">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <FaCircle className="text-blue-500 text-[8px] shadow-[0_0_8px_rgba(59,130,246,0.8)]" /> Male
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <FaCircle className="text-pink-500 text-[8px] shadow-[0_0_8px_rgba(236,72,153,0.8)]" /> Female
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. RECENT TOP PERFORMERS TABLE */}
                <div className="glass-liquid rounded-3xl p-8 border border-white/10 mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Assessment Leaders</h3>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Top 5 by Grade Score</div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-xs text-slate-500 uppercase tracking-wider">
                                    <th className="pb-4 pl-4">Rank</th>
                                    <th className="pb-4">Fighter</th>
                                    <th className="pb-4">Batch</th>
                                    <th className="pb-4 text-right pr-4">Grade Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats.topFighters.slice(0, 5).map((f, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition group">
                                        <td className="py-4 pl-4">
                                            <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm shadow-lg ${i===0 ? 'bg-yellow-500 text-black shadow-yellow-500/20' : 'bg-slate-800 text-slate-400 border border-white/5'}`}>
                                                {i + 1}
                                            </span>
                                        </td>
                                        <td className="py-4 font-bold text-white group-hover:text-cyan-400 transition-colors">{f.name}</td>
                                        <td className="py-4 text-slate-400 text-sm font-mono">{f.fighterBatchNo}</td>
                                        <td className="py-4 text-right pr-4 text-green-400 font-mono font-bold text-lg">
                                            {f.assessment?.specialGradeScore || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;