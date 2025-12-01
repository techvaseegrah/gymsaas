import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { FaUser, FaEnvelope, FaIdCard, FaArrowLeft, FaCrown, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

const ViewFighterDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fighter, setFighter] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fighterRes, subRes] = await Promise.all([
                    api.get(`/fighters/${id}`),
                    api.get(`/subscriptions/fighter/${id}`)
                ]);
                setFighter(fighterRes.data);
                setSubscription(subRes.data);
            } catch (err) {
                console.error("Error fetching details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
    if (!fighter) return <div className="text-center text-white p-10">Fighter not found</div>;

    // Calculate status
    const isSubActive = subscription && new Date(subscription.endDate) > new Date();

    return (
        <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
            <button 
                onClick={() => navigate('/admin')}
                className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Profile Card */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl md:col-span-1 text-center">
                    <div className="w-32 h-32 mx-auto bg-gray-700 rounded-full overflow-hidden mb-4 border-4 border-gray-600 shadow-lg">
                        <img 
                            src={fighter.profilePhoto || '/logo.png'} 
                            alt={fighter.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = '/logo.png'} 
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">{fighter.name}</h1>
                    <p className="text-gray-400 text-sm mb-4">{fighter.email}</p>
                    
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isSubActive ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
                        {isSubActive ? 'Active Member' : 'No Plan / Expired'}
                    </div>
                </div>

                {/* Details Column */}
                <div className="md:col-span-2 space-y-6">
                    
                    {/* Core Info */}
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">Fighter Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">RFID Tag</p>
                                <div className="flex items-center text-white">
                                    <FaIdCard className="mr-2 text-blue-500" />
                                    <span className="font-mono">{fighter.rfid || 'Not Assigned'}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Batch No</p>
                                <p className="text-white font-medium">{fighter.fighterBatchNo || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Joined Date</p>
                                <p className="text-white font-medium">{new Date(fighter.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Info (The Requested Feature) */}
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FaCrown className="text-9xl text-yellow-500" />
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2 flex items-center">
                            Current Membership Plan
                        </h3>

                        {subscription ? (
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{subscription.planName}</h2>
                                        <p className="text-gray-400 text-sm flex items-center mt-1">
                                            <FaMoneyBillWave className="mr-2 text-green-500" /> 
                                            Paid via {subscription.paymentMode}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-bold text-green-400">₹{subscription.amount}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-gray-900/50 rounded-xl p-4 border border-gray-600">
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase mb-1">Start Date</p>
                                        <p className="text-white font-mono font-semibold flex items-center">
                                            <FaCalendarAlt className="mr-2 text-blue-400" />
                                            {new Date(subscription.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500 text-xs uppercase mb-1">End Date</p>
                                        <p className={`font-mono font-semibold flex items-center justify-end ${isSubActive ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {new Date(subscription.endDate).toLocaleDateString()}
                                            <FaCalendarAlt className="ml-2" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                <p>No active subscription found.</p>
                                <button 
                                    onClick={() => navigate('/admin/subscriptions')}
                                    className="mt-3 text-blue-400 hover:text-blue-300 text-sm underline"
                                >
                                    Assign a Plan
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViewFighterDetailsPage;