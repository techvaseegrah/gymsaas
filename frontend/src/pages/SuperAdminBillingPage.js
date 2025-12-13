import React, { useState, useEffect } from 'react';
import SuperAdminPageTemplate from '../components/SuperAdminPageTemplate';
import { FaMoneyBillWave, FaCreditCard, FaReceipt, FaEye, FaFileInvoice, FaTimes, FaSearch, FaCalendarAlt, FaFileExcel } from 'react-icons/fa';
import api from '../api/api';
import { exportToExcel } from '../utils/exportUtils';

const SuperAdminBillingPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // View Modal State
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedGymHistory, setSelectedGymHistory] = useState([]);
    const [selectedGymName, setSelectedGymName] = useState('');
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const res = await api.get('/superadmin/subscriptions');
            // Sort by most recent start date
            const sorted = res.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            setSubscriptions(sorted);
        } catch (err) {
            console.error('Failed to fetch subscriptions:', err);
        } finally {
            setLoading(false);
        }
    };

    // --- Export Functionality ---
    const exportBillingToExcel = () => {
        const exportData = subscriptions.map(sub => ({
            'Gym Name': sub.tenant?.name || 'Unknown Gym',
            'Plan': sub.planName,
            'Amount': `₹${sub.amount}`,
            'Start Date': new Date(sub.startDate).toLocaleDateString(),
            'End Date': new Date(sub.endDate).toLocaleDateString(),
            'Status': sub.status,
            'Created At': sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'N/A',
            'Transaction ID': sub.transactionId || 'N/A'
        }));
        
        exportToExcel(exportData, 'billing-report', 'Billing Report');
    };

    // --- Fetch History for a specific Tenant ---
    const handleViewHistory = async (tenantId, gymName) => {
        setSelectedGymName(gymName);
        setIsViewModalOpen(true);
        setHistoryLoading(true);
        try {
            const res = await api.get(`/superadmin/tenants/${tenantId}/payments`);
            setSelectedGymHistory(res.data);
        } catch (err) {
            console.error('Failed to fetch gym payment history:', err);
            setSelectedGymHistory([]);
        } finally {
            setHistoryLoading(false);
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
                subtitle="Manage subscriptions"
                icon={FaMoneyBillWave}
                showAddNew={false}
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
            showAddNew={false}
        >
            {/* Top Stats Cards */}
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
                            <p className="text-sm text-gray-400">Total Transactions</p>
                            <p className="text-3xl font-bold">{subscriptions.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Transactions Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-200">Recent Transactions</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={exportBillingToExcel}
                            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                        >
                            <FaFileExcel className="mr-2" /> Export
                        </button>
                        <div className="relative w-full md:w-auto">
                            <input 
                                type="text" 
                                placeholder="Search gym or plan..." 
                                className="w-full md:w-64 bg-gray-900 border border-gray-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-purple-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-500" />
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-gray-700 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4">Gym Name</th>
                                <th className="p-4">Plan</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Billing Cycle</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredSubscriptions.map((sub) => (
                                <tr key={sub._id} className="hover:bg-gray-700/50 transition">
                                    <td className="p-4 font-bold text-white flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 text-xs">
                                            {sub.tenant?.name?.substring(0, 2).toUpperCase() || 'NA'}
                                        </div>
                                        {sub.tenant?.name || 'Unknown Gym'}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-gray-700 rounded text-xs">{sub.planName}</span>
                                    </td>
                                    <td className="p-4 text-green-400 font-bold font-mono">₹{sub.amount}</td>
                                    <td className="p-4 text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <FaCalendarAlt />
                                            {new Date(sub.startDate).toLocaleDateString()}
                                        </div>
                                    </td>
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
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleViewHistory(sub.tenant?._id, sub.tenant?.name)}
                                                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition group relative"
                                                title="View History"
                                            >
                                                <FaEye />
                                            </button>
                                            <button 
                                                className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition"
                                                title="Download Invoice"
                                            >
                                                <FaFileInvoice />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredSubscriptions.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No transactions found matching your search.
                        </div>
                    )}
                </div>
            </div>

            {/* --- Payment History Modal --- */}
            {isViewModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-3xl shadow-2xl max-h-[85vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800 rounded-t-2xl">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaReceipt className="text-green-500" /> Payment History
                                </h3>
                                <p className="text-sm text-purple-400 mt-1 font-semibold">{selectedGymName}</p>
                            </div>
                            <button 
                                onClick={() => setIsViewModalOpen(false)}
                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-400 hover:text-white transition"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-0 overflow-y-auto custom-scrollbar flex-grow">
                            {historyLoading ? (
                                <div className="flex justify-center items-center h-48">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                                </div>
                            ) : selectedGymHistory.length === 0 ? (
                                <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                                    <FaReceipt size={40} className="mb-4 opacity-20" />
                                    <p>No payment history found for this gym.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm text-gray-300">
                                    <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-semibold sticky top-0">
                                        <tr>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Plan Name</th>
                                            <th className="p-4">Period</th>
                                            <th className="p-4">Amount</th>
                                            <th className="p-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {selectedGymHistory.map((historyItem, idx) => (
                                            <tr key={idx} className="hover:bg-gray-700/30 transition">
                                                <td className="p-4 text-white">
                                                    {new Date(historyItem.startDate).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 font-medium text-purple-300">
                                                    {historyItem.planName}
                                                </td>
                                                <td className="p-4 text-xs text-gray-500">
                                                    {new Date(historyItem.startDate).toLocaleDateString()} - {new Date(historyItem.endDate).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 font-mono text-green-400 font-bold">
                                                    ₹{historyItem.amount}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        historyItem.status === 'Active' ? 'bg-green-900/30 text-green-400 border border-green-500/30' :
                                                        'bg-gray-800 text-gray-400 border border-gray-600'
                                                    }`}>
                                                        {historyItem.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-700 bg-gray-900/30 rounded-b-2xl flex justify-end">
                            <button 
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminPageTemplate>
    );
};

export default SuperAdminBillingPage;