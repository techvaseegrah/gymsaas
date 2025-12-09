import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaUser, FaMoneyBillWave, FaCalendarAlt, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const AdminSubscriptionPage = () => {
    const [fighters, setFighters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFighter, setSelectedFighter] = useState('');
    const [formData, setFormData] = useState({
        planName: 'Monthly',
        amount: '',
        durationMonths: 1,
        paymentMode: 'Cash'
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchFighters = async () => {
            try {
                const res = await api.get('/fighters/roster'); 
                setFighters(res.data);
            } catch (err) {
                console.error("Failed to fetch fighters");
            } finally {
                setLoading(false);
            }
        };
        fetchFighters();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFighter) return alert('Please select a fighter');

        try {
            await api.post('/subscriptions/assign', {
                fighterId: selectedFighter,
                ...formData
            });
            setMessage('Subscription assigned successfully!');
            setFormData({ planName: 'Monthly', amount: '', durationMonths: 1, paymentMode: 'Cash' });
            setSelectedFighter('');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            alert(err.response?.data?.msg || 'Error assigning subscription');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading Roster...</div>;

    const inputClass = "w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all";
    const labelClass = "block text-xs font-mono text-green-400 mb-2 uppercase tracking-wider";

    return (
        <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
            
            <div className="max-w-2xl w-full glass-liquid rounded-2xl p-8 relative overflow-hidden border border-white/10">
                {/* Background Glow */}
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <span className="p-2 bg-green-500/20 rounded-lg text-green-400"><FaMoneyBillWave /></span>
                        Assign Membership
                    </h2>
                    <p className="text-slate-400 mb-8 ml-11">Grant access and log payment for a fighter.</p>

                    {message && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-center gap-3 animate-fade-in">
                            <FaCheckCircle /> {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Fighter Selection */}
                        <div>
                            <label className={labelClass}>Select Fighter</label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <select 
                                    className={`${inputClass} pl-10 appearance-none`}
                                    value={selectedFighter}
                                    onChange={(e) => setSelectedFighter(e.target.value)}
                                    required
                                >
                                    <option value="" className="bg-gray-900">-- Select from Roster --</option>
                                    {fighters.map(f => (
                                        <option key={f._id} value={f._id} className="bg-gray-900">{f.name} (Batch: {f.fighterBatchNo})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Plan Name</label>
                                <input type="text" name="planName" value={formData.planName} onChange={handleChange} className={inputClass} placeholder="e.g. Gold Plan" required />
                            </div>
                            
                            <div>
                                <label className={labelClass}>Amount (₹)</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className={inputClass} placeholder="1500" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Duration (Months)</label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input type="number" name="durationMonths" value={formData.durationMonths} onChange={handleChange} className={`${inputClass} pl-10`} min="1" required />
                                </div>
                            </div>
                            
                            <div>
                                <label className={labelClass}>Payment Mode</label>
                                <div className="relative">
                                    <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className={`${inputClass} pl-10 appearance-none`}>
                                        <option className="bg-gray-900">Cash</option>
                                        <option className="bg-gray-900">UPI</option>
                                        <option className="bg-gray-900">Card</option>
                                        <option className="bg-gray-900">Bank Transfer</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] transition-all duration-200">
                            Confirm & Activate
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSubscriptionPage;