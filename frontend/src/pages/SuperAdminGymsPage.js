import React, { useState, useEffect } from 'react';
import SuperAdminPageTemplate from '../components/SuperAdminPageTemplate';
import { FaBuilding, FaCheckCircle, FaBan } from 'react-icons/fa';
import api from '../api/api';

const SuperAdminGymsPage = () => {
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchGyms();
    }, []);

    const fetchGyms = async () => {
        try {
            const res = await api.get('/superadmin/tenants');
            setGyms(res.data);
        } catch (err) {
            console.error('Failed to fetch gyms:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleGymStatus = async (id, currentStatus) => {
        try {
            await api.put(`/superadmin/tenants/${id}/status`, {
                status: currentStatus ? 'inactive' : 'active'
            });
            fetchGyms(); // Refresh the list
        } catch (err) {
            console.error('Failed to update gym status:', err);
        }
    };

    const filteredGyms = gyms.filter(gym => 
        gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gym.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <SuperAdminPageTemplate 
                title="Gym Management" 
                subtitle="Manage all gyms in the platform"
                icon={FaBuilding}
            >
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </SuperAdminPageTemplate>
        );
    }

    return (
        <SuperAdminPageTemplate 
            title="Gym Management" 
            subtitle="Manage all gyms in the platform"
            icon={FaBuilding}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-900/50 to-gray-800 border border-purple-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                            <FaBuilding size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Gyms</p>
                            <p className="text-3xl font-bold">{gyms.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-900/50 to-gray-800 border border-green-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                            <FaCheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Active Gyms</p>
                            <p className="text-3xl font-bold">{gyms.filter(g => g.isActive).length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-900/50 to-gray-800 border border-red-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/20 rounded-lg text-red-400">
                            <FaBan size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Suspended Gyms</p>
                            <p className="text-3xl font-bold">{gyms.filter(g => !g.isActive).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-200">All Gyms</h2>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search gyms..." 
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
                            <th className="p-4">Gym Name</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Plan</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredGyms.map((gym) => (
                            <tr key={gym._id} className="hover:bg-gray-700/50 transition">
                                <td className="p-4 font-bold text-white">{gym.name}</td>
                                <td className="p-4 text-blue-400 font-mono">{gym.slug}</td>
                                <td className="p-4">{gym.email}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded text-xs font-bold bg-purple-900/50 text-purple-400">
                                        {gym.subscriptionPlan}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${gym.isActive ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                                        {gym.isActive ? 'ACTIVE' : 'SUSPENDED'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        className={`px-3 py-1 rounded text-xs font-bold ${gym.isActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
                                        onClick={() => toggleGymStatus(gym._id, gym.isActive)}
                                    >
                                        {gym.isActive ? 'Suspend' : 'Activate'}
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

export default SuperAdminGymsPage;