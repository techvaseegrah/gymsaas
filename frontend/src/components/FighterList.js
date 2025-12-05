import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaSearch, FaIdCard } from 'react-icons/fa';
import api from '../api/api';

const FighterList = ({ fighters: initialFighters, handleDelete: parentHandleDelete }) => {
    // Note: If passed from parent, use that data. Otherwise fetch (legacy support)
    const [localFighters, setLocalFighters] = useState([]);
    const [loading, setLoading] = useState(!initialFighters);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (initialFighters) {
            setLocalFighters(initialFighters);
            setLoading(false);
        } else {
            const fetchFighters = async () => {
                try {
                    const res = await api.get('/fighters/roster');
                    setLocalFighters(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchFighters();
        }
    }, [initialFighters]);

    // Use parent delete if available, else local
    const onDelete = parentHandleDelete || (async (id) => {
        // Local delete logic if needed
    });

    const filteredFighters = localFighters.filter(fighter =>
        fighter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fighter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (fighter.fighterBatchNo && fighter.fighterBatchNo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="p-8 text-slate-400 text-center">Syncing roster data...</div>;

    return (
        <div className="bg-[#0a0a0a]/40 backdrop-blur-md rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or batch..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                    Total Fighters: <span className="text-cyan-400 text-sm font-bold">{filteredFighters.length}</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-slate-400 font-medium">
                            <th className="py-4 px-6">Identity</th>
                            <th className="py-4 px-6 text-center">Batch</th>
                            <th className="py-4 px-6 text-center">RFID Tag</th>
                            <th className="py-4 px-6">Contact</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredFighters.map(fighter => (
                            <tr key={fighter._id} className="hover:bg-white/5 transition-colors duration-150 group">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                                            {fighter.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{fighter.name}</p>
                                            <p className="text-xs text-slate-500">ID: {fighter._id.slice(-4)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                        {fighter.fighterBatchNo || 'N/A'}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {fighter.rfid ? (
                                        <div className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                                            <FaIdCard /> Linked
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-600">Pending</span>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-sm text-slate-400">
                                    {fighter.email}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex justify-end items-center gap-1">
                                        <Link 
                                            to={`/admin/fighter/${fighter._id}`} 
                                            className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors tooltip"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </Link>
                                        <Link 
                                            to={`/admin/edit-fighter/${fighter._id}`} 
                                            className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
                                            title="Edit Profile"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button 
                                            onClick={() => onDelete(fighter._id)} 
                                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredFighters.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-12 text-center text-slate-600">
                                    No fighters found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FighterList;