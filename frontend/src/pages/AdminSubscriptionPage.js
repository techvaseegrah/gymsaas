import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaUser, FaMoneyBill, FaCheckCircle } from 'react-icons/fa';

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
                const res = await api.get('/fighters/roster'); // Fetches list of fighters
                setFighters(res.data);
            } catch (err) {
                console.error("Failed to fetch fighters");
            } finally {
                setLoading(false);
            }
        };
        fetchFighters();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
        } catch (err) {
            alert(err.response?.data?.msg || 'Error assigning subscription');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Subscriptions</h1>

            <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto border border-gray-100">
                <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center gap-2">
                    <FaMoneyBill className="text-green-500" /> Assign New Membership
                </h2>

                {message && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                        <FaCheckCircle /> {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Select Fighter</label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-3 text-gray-400" />
                            <select 
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                                value={selectedFighter}
                                onChange={(e) => setSelectedFighter(e.target.value)}
                                required
                            >
                                <option value="">-- Choose a Fighter --</option>
                                {fighters.map(f => (
                                    <option key={f._id} value={f._id}>{f.name} ({f.rfid})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Plan Name</label>
                            <input 
                                type="text" name="planName" 
                                value={formData.planName} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Gold Plan" required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Amount (₹)</label>
                            <input 
                                type="number" name="amount" 
                                value={formData.amount} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. 1500" required 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Duration (Months)</label>
                            <input 
                                type="number" name="durationMonths" 
                                value={formData.durationMonths} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                min="1" required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Payment Mode</label>
                            <select 
                                name="paymentMode" 
                                value={formData.paymentMode} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option>Cash</option>
                                <option>UPI</option>
                                <option>Card</option>
                                <option>Bank Transfer</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg">
                        Assign Subscription
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSubscriptionPage;