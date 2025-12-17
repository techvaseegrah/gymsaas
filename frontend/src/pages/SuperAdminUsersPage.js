import React, { useState, useEffect } from 'react';
import SuperAdminPageTemplate from '../components/SuperAdminPageTemplate';
import { FaUsers, FaUserShield, FaUserFriends, FaFileExcel } from 'react-icons/fa';
import api from '../api/api';
import { exportToExcel } from '../utils/exportUtils';

const SuperAdminUsersPage = () => {
    const [admins, setAdmins] = useState([]);
    const [fighters, setFighters] = useState([]);
    const [superadmins, setSuperadmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('admins');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const [adminsRes, fightersRes, superadminsRes] = await Promise.all([
                api.get('/superadmin/users/admins'),
                api.get('/superadmin/users/fighters'),
                api.get('/superadmin/users/superadmins')
            ]);
            
            setAdmins(adminsRes.data);
            setFighters(fightersRes.data);
            setSuperadmins(superadminsRes.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentUsers = () => {
        switch (activeTab) {
            case 'admins': return admins;
            case 'fighters': return fighters;
            case 'superadmins': return superadmins;
            default: return [];
        }
    };

    const getCurrentTitle = () => {
        switch (activeTab) {
            case 'admins': return 'Admins';
            case 'fighters': return 'Fighters';
            case 'superadmins': return 'Super Admins';
            default: return '';
        }
    };

    // --- Export Functionality ---
    const exportUsersToExcel = () => {
        const currentUsers = getCurrentUsers();
        const userType = getCurrentTitle();
        
        const exportData = currentUsers.map(user => {
            const baseData = {
                'Name': user.name || 'N/A',
                'Email': user.email,
                'Role': user.role === 'admin' ? 'Admin' : 
                       user.role === 'fighter' ? 'Fighter' : 'Super Admin',
                'Gym': user.tenant?.name || 'N/A',
                'Status': 'Active',
                'Created At': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
            };
            
            // Add RFID for fighters
            if (user.role === 'fighter') {
                baseData['RFID'] = user.rfid || 'N/A';
            }
            
            return baseData;
        });
        
        exportToExcel(exportData, `${userType.toLowerCase()}-report`, `${userType} Report`);
    };    const filteredUsers = getCurrentUsers().filter(user => 
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <SuperAdminPageTemplate 
                title="User Management" 
                subtitle="Manage all users across the platform"
                icon={FaUsers}
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
            title="User Management" 
            subtitle="Manage all users across the platform"
            icon={FaUsers}
            showAddNew={false}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-900/50 to-gray-800 border border-purple-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                            <FaUsers size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Users</p>
                            <p className="text-3xl font-bold">{admins.length + fighters.length + superadmins.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-900/50 to-gray-800 border border-blue-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                            <FaUserShield size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Admins</p>
                            <p className="text-3xl font-bold">{admins.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-900/50 to-gray-800 border border-green-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                            <FaUserFriends size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Fighters</p>
                            <p className="text-3xl font-bold">{fighters.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-200">All Users</h2>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'admins' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('admins')}
                            >
                                Admins
                            </button>
                            <button 
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'fighters' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('fighters')}
                            >
                                Fighters
                            </button>
                            <button 
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'superadmins' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('superadmins')}
                            >
                                Super Admins
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={exportUsersToExcel}
                                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                            >
                                <FaFileExcel className="mr-2" /> Export
                            </button>
                            <div className="relative w-full md:w-auto">
                                <input 
                                    type="text" 
                                    placeholder={`Search ${getCurrentTitle()}...`} 
                                    className="bg-gray-900 border border-gray-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-purple-500 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg className="absolute left-3 top-2.5 text-gray-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-gray-700 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Gym</th>
                            {activeTab === 'fighters' && <th className="p-4">RFID</th>}
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-700/50 transition">
                                <td className="p-4 font-bold text-white">{user.name || 'N/A'}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        user.role === 'admin' ? 'bg-blue-900/50 text-blue-400' :
                                        user.role === 'fighter' ? 'bg-green-900/50 text-green-400' :
                                        'bg-purple-900/50 text-purple-400'
                                    }`}>
                                        {user.role === 'admin' ? 'Admin' : 
                                         user.role === 'fighter' ? 'Fighter' : 'Super Admin'}
                                    </span>
                                </td>
                                <td className="p-4">{user.tenant?.name || 'N/A'}</td>
                                {activeTab === 'fighters' && <td className="p-4 font-mono text-sm">{user.rfid || 'N/A'}</td>}
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded text-xs font-bold bg-green-900/50 text-green-400">
                                        Active
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-bold mr-2">
                                        Edit
                                    </button>
                                    <button className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold">
                                        Disable
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

export default SuperAdminUsersPage;