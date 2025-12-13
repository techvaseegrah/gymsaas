import React, { useState, useEffect } from 'react';
import SuperAdminPageTemplate from '../components/SuperAdminPageTemplate';
import { FaBuilding, FaCheckCircle, FaBan, FaPlus, FaEdit, FaTimes, FaFileExcel } from 'react-icons/fa';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { exportToExcel } from '../utils/exportUtils';

const SuperAdminGymsPage = () => {
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedGym, setSelectedGym] = useState(null);
    const [editFormData, setEditFormData] = useState({
        gymName: '',
        email: '',
        password: '', // Optional for reset
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        }
    });

    const navigate = useNavigate();

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
            fetchGyms(); 
        } catch (err) {
            console.error('Failed to update gym status:', err);
        }
    };

    // --- Export Functionality ---
    const exportGymsToExcel = () => {
        const exportData = gyms.map(gym => ({
            'Gym Name': gym.name,
            'Slug': gym.slug,
            'Members': gym.memberCount || 0,
            'Email': gym.email,
            'Phone': gym.phone || '',
            'Plan': gym.subscriptionPlan,
            'Status': gym.isActive ? 'Active' : 'Suspended',
            'Created At': gym.createdAt ? new Date(gym.createdAt).toLocaleDateString() : 'N/A'
        }));
        
        exportToExcel(exportData, 'gyms-report', 'Gyms');
    };

    // --- Edit Functions ---
    const handleEditClick = (gym) => {
        setSelectedGym(gym);
        setEditFormData({
            gymName: gym.name,
            email: gym.email,
            password: '', // Empty by default
            phone: gym.phone || '',
            address: gym.address || {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            }
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/superadmin/tenants/${selectedGym._id}`, editFormData);
            setIsEditModalOpen(false);
            fetchGyms(); // Refresh list to see changes
            alert('Gym updated successfully');
        } catch (err) {
            console.error('Update failed:', err);
            // Provide more detailed error feedback to the user
            if (err.response && err.response.data && err.response.data.msg) {
                alert(`Failed to update gym: ${err.response.data.msg}\n${err.response.data.error || ''}`);
            } else {
                alert('Failed to update gym: ' + (err.message || 'Unknown error'));
            }
        }
    };

    const filteredGyms = gyms.filter(gym => 
        gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gym.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <SuperAdminPageTemplate title="Gym Management" subtitle="Manage all gyms" icon={FaBuilding} showAddNew={false}>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </SuperAdminPageTemplate>
        );
    }

    return (
        <SuperAdminPageTemplate title="Gym Management" subtitle="Manage all gyms in the platform" icon={FaBuilding} showAddNew={false}>
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-900/50 to-gray-800 border border-purple-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400"><FaBuilding size={24} /></div>
                        <div><p className="text-sm text-gray-400">Total Gyms</p><p className="text-3xl font-bold">{gyms.length}</p></div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-900/50 to-gray-800 border border-green-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-lg text-green-400"><FaCheckCircle size={24} /></div>
                        <div><p className="text-sm text-gray-400">Active Gyms</p><p className="text-3xl font-bold">{gyms.filter(g => g.isActive).length}</p></div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-900/50 to-gray-800 border border-red-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/20 rounded-lg text-red-400"><FaBan size={24} /></div>
                        <div><p className="text-sm text-gray-400">Suspended Gyms</p><p className="text-3xl font-bold">{gyms.filter(g => !g.isActive).length}</p></div>
                    </div>
                </div>
            </div>

            {/* Gym List Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-200">All Gyms</h2>
                    <div className="flex w-full md:w-auto gap-4">
                        <div className="relative flex-grow md:flex-grow-0">
                            <input 
                                type="text" 
                                placeholder="Search gyms..." 
                                className="w-full bg-gray-900 border border-gray-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-purple-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="absolute left-3 top-2.5 text-gray-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </div>
                        <button 
                            onClick={exportGymsToExcel}
                            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                        >
                            <FaFileExcel className="mr-2" /> Export
                        </button>
                        <button 
                            onClick={() => navigate('/superadmin/gyms/create')}
                            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-purple-900/50"
                        >
                            <FaPlus className="mr-2" /> Add Gym
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-gray-700 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4">Gym Name</th>
                                <th className="p-4">Slug</th>
                                <th className="p-4">Members</th>
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
                                    <td className="p-4">
                                        <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-300 font-bold border border-blue-500/30">
                                            {gym.memberCount || 0}
                                        </span>
                                    </td>
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
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleEditClick(gym)}
                                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                                                title="Edit Credentials"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className={`px-3 py-1 rounded text-xs font-bold ${gym.isActive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                                                onClick={() => toggleGymStatus(gym._id, gym.isActive)}
                                            >
                                                {gym.isActive ? 'Suspend' : 'Activate'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Edit Modal --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700">
                            <h3 className="text-xl font-bold text-white">Edit Gym Credentials</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Gym Name</label>
                                <input 
                                    type="text"
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                    value={editFormData.gymName}
                                    onChange={(e) => setEditFormData({...editFormData, gymName: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Admin Email</label>
                                <input 
                                    type="email"
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">New Password (Optional)</label>
                                <input 
                                    type="password"
                                    placeholder="Leave blank to keep current password"
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                    value={editFormData.password}
                                    onChange={(e) => setEditFormData({...editFormData, password: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Phone</label>
                                <input 
                                    type="text"
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                    value={editFormData.phone}
                                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Street Address</label>
                                <input 
                                    type="text"
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                    value={editFormData.address.street || ''}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData, 
                                        address: {...editFormData.address, street: e.target.value}
                                    })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">City</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                        value={editFormData.address.city || ''}
                                        onChange={(e) => setEditFormData({
                                            ...editFormData, 
                                            address: {...editFormData.address, city: e.target.value}
                                        })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">State</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                        value={editFormData.address.state || ''}
                                        onChange={(e) => setEditFormData({
                                            ...editFormData, 
                                            address: {...editFormData.address, state: e.target.value}
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">ZIP Code</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                        value={editFormData.address.zipCode || ''}
                                        onChange={(e) => setEditFormData({
                                            ...editFormData, 
                                            address: {...editFormData.address, zipCode: e.target.value}
                                        })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Country</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                        value={editFormData.address.country || ''}
                                        onChange={(e) => setEditFormData({
                                            ...editFormData, 
                                            address: {...editFormData.address, country: e.target.value}
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SuperAdminPageTemplate>
    );
};

export default SuperAdminGymsPage;