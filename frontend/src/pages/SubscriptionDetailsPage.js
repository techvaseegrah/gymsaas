import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaCrown, FaHistory } from 'react-icons/fa';

const SubscriptionDetailsPage = () => {
    const [subscription, setSubscription] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subRes, histRes] = await Promise.all([
                    api.get('/subscriptions/me'),
                    api.get('/subscriptions/history')
                ]);
                setSubscription(subRes.data);
                setHistory(histRes.data);
            } catch (err) {
                console.error("Error fetching subscription data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;

    const isExpired = subscription && new Date(subscription.endDate) < new Date();

    return (
        <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-white">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <FaCrown className="text-yellow-500" /> My Membership
            </h1>

            <div className={`rounded-2xl p-8 mb-8 shadow-2xl border ${isExpired ? 'bg-gray-800 border-red-500' : 'bg-gradient-to-br from-blue-900 to-gray-900 border-blue-500'}`}>
                {subscription ? (
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{subscription.planName}</h2>
                                <p className={`text-sm font-bold uppercase tracking-widest mt-1 ${isExpired ? 'text-red-400' : 'text-green-400'}`}>
                                    {isExpired ? 'Expired' : 'Active Plan'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-white">₹{subscription.amount}</p>
                                <p className="text-gray-400 text-sm">{subscription.paymentMode}</p>
                            </div>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 border border-white/10">
                            <div>
                                <p className="text-gray-400 text-xs uppercase">Start Date</p>
                                <p className="font-mono font-bold text-lg">{new Date(subscription.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="md:text-right">
                                <p className="text-gray-400 text-xs uppercase">Expires On</p>
                                <p className={`font-mono font-bold text-lg ${isExpired ? 'text-red-400' : 'text-yellow-400'}`}>
                                    {new Date(subscription.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <p>No active subscription found.</p>
                    </div>
                )}
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-300">
                    <FaHistory /> Payment History
                </h3>
                <div className="space-y-4">
                    {history.length > 0 ? history.map(sub => (
                        <div key={sub._id} className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                            <div>
                                <p className="font-bold text-white">{sub.planName}</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-green-400">₹{sub.amount}</span>
                            </div>
                        </div>
                    )) : <p className="text-gray-500">No history available.</p>}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionDetailsPage;