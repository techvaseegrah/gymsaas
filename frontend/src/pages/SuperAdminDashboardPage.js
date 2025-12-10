import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { 
    FaBuilding, FaUsers, FaChartLine, FaBan, FaCheckCircle, 
    FaMoneyBillWave, FaCogs, FaSearch, FaFileInvoiceDollar 
} from 'react-icons/fa';

// --- CHART IMPORTS ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SuperAdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [revenueTrends, setRevenueTrends] = useState([]);
    const [userGrowth, setUserGrowth] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const [statsRes, tenantsRes, subsRes, revenueRes, userGrowthRes] = await Promise.all([
                api.get('/superadmin/dashboard'),
                api.get('/superadmin/tenants'),
                api.get('/superadmin/subscriptions'),
                api.get('/superadmin/analytics/revenue-trends'),
                api.get('/superadmin/analytics/user-growth')
            ]);
            setStats(statsRes.data);
            setTenants(tenantsRes.data);
            setSubscriptions(subsRes.data);
            setRevenueTrends(revenueRes.data);
            setUserGrowth(userGrowthRes.data);
        } catch (err) {
            console.error("Failed to load superadmin data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleGymStatus = async (id, currentStatus) => {
        if(!window.confirm(`Confirm ${currentStatus ? 'ACTIVATE' : 'SUSPEND'}?`)) return;
        await api.put(`/superadmin/tenants/${id}/status`);
        fetchData();
    };

    const filteredTenants = tenants.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Process revenue trends data for the chart
    const processRevenueTrendsData = () => {
        if (!revenueTrends || revenueTrends.length === 0) {
            // Fallback to hardcoded data if no real data
            return {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Monthly Recurring Revenue (MRR)',
                        data: [45000, 52000, 49000, 62000, 75000, stats?.mmr || 85000],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#8b5cf6',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#8b5cf6',
                    },
                ],
            };
        }

        // Process real data
        const sortedData = [...revenueTrends].sort((a, b) => {
            const dateA = new Date(a._id.year, a._id.month - 1);
            const dateB = new Date(b._id.year, b._id.month - 1);
            return dateA - dateB;
        });

        // Take only the last 6 months for display
        const lastSixMonths = sortedData.slice(-6);

        const labels = lastSixMonths.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return date.toLocaleDateString('en-US', { month: 'short' });
        });

        const data = lastSixMonths.map(item => item.totalRevenue || 0);

        return {
            labels,
            datasets: [
                {
                    label: 'Monthly Recurring Revenue (MRR)',
                    data,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#8b5cf6',
                },
            ],
        };
    };

    // Process user growth data for the chart
    const processUserGrowthData = () => {
        if (!userGrowth || !userGrowth.tenantRegistrations) {
            // Fallback to hardcoded data if no real data
            return {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'New Gyms Joined',
                        data: [2, 4, 3, 5, 8, tenants.length],
                        backgroundColor: '#3b82f6',
                        borderRadius: 4,
                    },
                ],
            };
        }

        // Process real data
        const sortedData = [...userGrowth.tenantRegistrations].sort((a, b) => {
            const dateA = new Date(a._id.year, a._id.month - 1);
            const dateB = new Date(b._id.year, b._id.month - 1);
            return dateA - dateB;
        });

        // Take only the last 6 months for display
        const lastSixMonths = sortedData.slice(-6);

        const labels = lastSixMonths.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return date.toLocaleDateString('en-US', { month: 'short' });
        });

        const data = lastSixMonths.map(item => item.count || 0);

        return {
            labels,
            datasets: [
                {
                    label: 'New Gyms Joined',
                    data,
                    backgroundColor: '#3b82f6',
                    borderRadius: 4,
                },
            ],
        };
    };

    // Prepare chart data
    const revenueChartData = processRevenueTrendsData();
    const gymGrowthData = processUserGrowthData();

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#9ca3af' } },
        },
        scales: {
            y: {
                grid: { color: '#374151' },
                ticks: { color: '#9ca3af' },
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af' },
            },
        },
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;

    return (
        <div className="min-h-screen text-white font-sans">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-wide flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-sm">GR</div>
                        SUPER ADMIN
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Platform Overview & Management</p>
                </div>
                <div className="flex gap-2 bg-gray-800 p-1 rounded-lg mt-4 md:mt-0">
                    <button type="button" onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Overview</button>
                    <button type="button" onClick={() => setActiveTab('tenants')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'tenants' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Gyms</button>
                    <button type="button" onClick={() => setActiveTab('subscriptions')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'subscriptions' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Revenue</button>
                </div>
            </div>

            {/* --- OVERVIEW TAB --- */}
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                    
                    {/* 1. KEY METRICS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 rounded-2xl shadow-xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Gyms</p>
                                    <h3 className="text-4xl font-bold text-white mt-2">{stats?.totalTenants}</h3>
                                    <p className="text-green-400 text-xs mt-2 flex items-center gap-1"><FaChartLine /> +12% this month</p>
                                </div>
                                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><FaBuilding size={24} /></div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 rounded-2xl shadow-xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active Fighters</p>
                                    <h3 className="text-4xl font-bold text-white mt-2">{stats?.totalFighters}</h3>
                                    <p className="text-blue-400 text-xs mt-2 flex items-center gap-1"><FaChartLine /> +24% this month</p>
                                </div>
                                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><FaUsers size={24} /></div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 rounded-2xl shadow-xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Monthly Revenue</p>
                                    <h3 className="text-4xl font-bold text-white mt-2">₹{stats?.mmr?.toLocaleString()}</h3>
                                    <p className="text-green-400 text-xs mt-2 flex items-center gap-1"><FaChartLine /> +8% this month</p>
                                </div>
                                <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><FaMoneyBillWave size={24} /></div>
                            </div>
                        </div>
                    </div>

                    {/* 2. ANALYTICS CHARTS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-4">Revenue Trends</h3>
                            <div className="h-64">
                                <Line data={revenueChartData} options={chartOptions} />
                            </div>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-4">Gym Acquisition</h3>
                            <div className="h-64">
                                <Bar data={gymGrowthData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TENANTS TAB --- */}
            {activeTab === 'tenants' && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden animate-fade-in shadow-2xl">
                    <div className="p-6 border-b border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-200">Registered Gyms</h2>
                        <div className="relative w-full md:w-auto">
                            <FaSearch className="absolute left-3 top-3 text-gray-500" />
                            <input 
                                type="text" placeholder="Search Gyms..." 
                                className="w-full md:w-64 bg-gray-900 border border-gray-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-gray-700 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="p-4">Gym Name</th>
                                    <th className="p-4">Slug (ID)</th>
                                    <th className="p-4">Plan</th>
                                    <th className="p-4">Members</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredTenants.map(gym => (
                                    <tr key={gym._id} className="hover:bg-gray-700/50 transition">
                                        <td className="p-4 font-bold text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white">
                                                {gym.name.charAt(0)}
                                            </div>
                                            {gym.name}
                                        </td>
                                        <td className="p-4 text-purple-400 font-mono text-xs">{gym.slug}</td>
                                        <td className="p-4"><span className="bg-gray-700 px-2 py-1 rounded text-xs">{gym.subscriptionPlan || 'Basic'}</span></td>
                                        <td className="p-4">{gym.memberCount || 0}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${gym.isActive ? 'bg-green-900/30 text-green-400 border-green-700' : 'bg-red-900/30 text-red-400 border-red-700'}`}>
                                                {gym.isActive ? 'ACTIVE' : 'SUSPENDED'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button type="button" onClick={() => toggleGymStatus(gym._id, gym.isActive)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-md ${gym.isActive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                                                {gym.isActive ? <div className="flex items-center gap-1"><FaBan /> Suspend</div> : <div className="flex items-center gap-1"><FaCheckCircle /> Activate</div>}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredTenants.length === 0 && (
                            <div className="p-8 text-center text-gray-500">No gyms found.</div>
                        )}
                    </div>
                </div>
            )}

            {/* --- PAYMENTS TAB (SaaS Revenue) --- */}
            {activeTab === 'subscriptions' && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden animate-fade-in shadow-2xl">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                            <FaFileInvoiceDollar className="text-green-500" /> Payment History
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-gray-700 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="p-4">Gym Name</th>
                                    <th className="p-4">Plan</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {subscriptions.length > 0 ? subscriptions.map(sub => (
                                    <tr key={sub._id} className="hover:bg-gray-700/50 transition">
                                        <td className="p-4 font-bold text-white">{sub.tenant?.name || 'Unknown Gym'}</td>
                                        <td className="p-4">{sub.planName}</td>
                                        <td className="p-4 text-green-400 font-mono font-bold">₹{sub.amount}</td>
                                        <td className="p-4 text-gray-400">{new Date(sub.startDate).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${sub.status === 'Active' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-gray-700 text-gray-400 border-gray-600'}`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="p-12 text-center text-gray-500">No payment history found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SuperAdminDashboardPage;