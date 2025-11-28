import React, { useState, useEffect } from 'react';
import SuperAdminPageTemplate from '../components/SuperAdminPageTemplate';
import { FaMoneyBillWave, FaCreditCard, FaReceipt } from 'react-icons/fa';
import api from '../api/api';

const SuperAdminBillingPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const res = await api.get('/superadmin/subscriptions');
            setSubscriptions(res.data);
        } catch (err) {
            console.error('Failed to fetch subscriptions:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredSubscriptions = subscriptions.filter(sub => 
        (sub.tenant?.name && sub.tenant.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sub.planName && sub.planName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Calculate totals
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'Active').length;

    if (loading) {
        return (
            <SuperAdminPageTemplate 
                title="Billing & Revenue" 
                subtitle="Manage subscriptions and payments across all gyms"
                icon={FaMoneyBillWave}
            >
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </SuperAdminPageTemplate>
        );
    }

    return (
        <SuperAdminPageTemplate 
            title="Billing & Revenue" 
            subtitle="Manage subscriptions and payments across all gyms"
            icon={FaMoneyBillWave}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-900/50 to-gray-800 border border-green-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                            <FaMoneyBillWave size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Revenue</p>
                            <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-900/50 to-gray-800 border border-blue-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                            <FaCreditCard size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Active Subscriptions</p>
                            <p className="text-3xl font-bold">{activeSubscriptions}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/50 to-gray-800 border border-purple-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                            <FaReceipt size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Subscriptions</p>
                            <p className="text-3xl font-bold">{subscriptions.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-200">Recent Transactions</h2>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            className="bg-gray-900 border border-gray-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-purple-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="absolute left-3 top-2.5 text-gray-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </div>
                </div>
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-gray-700 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="p-4">Gym</th>
                            <th className="p-4">Plan</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Start Date</th>
                            <th className="p-4">End Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredSubscriptions.map((sub) => (
                            <tr key={sub._id} className="hover:bg-gray-700/50 transition">
                                <td className="p-4 font-bold text-white">{sub.tenant?.name || 'Unknown Gym'}</td>
                                <td className="p-4">{sub.planName}</td>
                                <td className="p-4 text-green-400 font-bold">₹{sub.amount}</td>
                                <td className="p-4">{new Date(sub.startDate).toLocaleDateString()}</td>
                                <td className="p-4">{new Date(sub.endDate).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        sub.status === 'Active' ? 'bg-green-900/50 text-green-400' :
                                        sub.status === 'Expired' ? 'bg-red-900/50 text-red-400' :
                                        'bg-gray-900/50 text-gray-400'
                                    }`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-bold mr-2">
                                        View
                                    </button>
                                    <button className="px-3 py-1 bg-gray-600 text-white rounded text-xs font-bold">
                                        Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SuperAdminPageTemplate>
    );
};

export default SuperAdminBillingPage;