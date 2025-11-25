import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { 
    FaBuilding, FaUsers, FaChartLine, FaBan, FaCheckCircle, 
    FaMoneyBillWave, FaCogs, FaSearch, FaFileInvoiceDollar 
} from 'react-icons/fa';

const SuperAdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const [statsRes, tenantsRes, subsRes] = await Promise.all([
                api.get('/superadmin/dashboard'),
                api.get('/superadmin/tenants'),
                api.get('/superadmin/subscriptions')
            ]);
            setStats(statsRes.data);
            setTenants(tenantsRes.data);
            setSubscriptions(subsRes.data);
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

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Control Panel...</div>;

    return (
        <div className="min-h-screen bg-gray-900 p-6 text-white font-sans">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-wide">SUPER ADMIN</h1>
                    <p className="text-purple-400 text-sm">SaaS Management Console</p>
                </div>
                <div className="flex gap-2 bg-gray-800 p-1 rounded-lg mt-4 md:mt-0">
                    <button type="button" onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Overview</button>
                    <button type="button" onClick={() => setActiveTab('tenants')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'tenants' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Gyms</button>
                    <button type="button" onClick={() => setActiveTab('subscriptions')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'subscriptions' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Revenue</button>
                </div>
            </div>

            {/* --- OVERVIEW TAB --- */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    <div className="bg-gradient-to-br from-purple-900/50 to-gray-800 border border-purple-500/30 p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400"><FaBuilding size={24} /></div>
                            <div><p className="text-sm text-gray-400">Total Gyms</p><p className="text-3xl font-bold">{stats?.totalTenants}</p></div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/50 to-gray-800 border border-blue-500/30 p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400"><FaUsers size={24} /></div>
                            <div><p className="text-sm text-gray-400">Total Fighters</p><p className="text-3xl font-bold">{stats?.totalFighters}</p></div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/50 to-gray-800 border border-green-500/30 p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-lg text-green-400"><FaMoneyBillWave size={24} /></div>
                            <div><p className="text-sm text-gray-400">Total SaaS Revenue</p><p className="text-3xl font-bold">₹{stats?.mmr}</p></div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TENANTS TAB --- */}
            {activeTab === 'tenants' && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-200">Gym Management</h2>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-3 text-gray-500" />
                            <input 
                                type="text" placeholder="Search Gyms..." 
                                className="bg-gray-900 border border-gray-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-purple-500"
                                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                            />
                        </div>
                    </div>
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-gray-700 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4">Gym Name</th>
                                <th className="p-4">Slug</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredTenants.map(gym => (
                                <tr key={gym._id} className="hover:bg-gray-700/50 transition">
                                    <td className="p-4 font-bold text-white">{gym.name}</td>
                                    <td className="p-4 text-blue-400 font-mono">{gym.slug}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${gym.isSuspended ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}>
                                            {gym.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button type="button" onClick={() => toggleGymStatus(gym._id, gym.isSuspended)}
                                            className={`px-3 py-1 rounded text-xs font-bold ${gym.isSuspended ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                            {gym.isSuspended ? 'Activate' : 'Suspend'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- PAYMENTS TAB (SaaS Revenue) --- */}
            {activeTab === 'subscriptions' && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                            <FaFileInvoiceDollar className="text-green-500" /> SaaS Payment History
                        </h2>
                    </div>
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
                                <tr key={sub._id} className="hover:bg-gray-700/50">
                                    <td className="p-4 font-bold text-white">{sub.tenant?.name || 'Unknown Gym'}</td>
                                    <td className="p-4">{sub.planName}</td>
                                    <td className="p-4 text-green-400 font-bold">₹{sub.amount}</td>
                                    <td className="p-4">{new Date(sub.startDate).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs font-bold border border-green-800">
                                            {sub.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No payment history found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default SuperAdminDashboardPage;