import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaDumbbell, FaPlus, FaClipboardList } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GymStatsPage = () => {
    const [history, setHistory] = useState([]);
    const [formData, setFormData] = useState({ benchPress: '', squat: '', deadlift: '', notes: '' });
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/gym-stats/me');
            setHistory(data);
        } catch (err) {
            console.error("Failed to load stats");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/gym-stats', formData);
            setShowForm(false);
            setFormData({ benchPress: '', squat: '', deadlift: '', notes: '' });
            fetchHistory();
        } catch (err) {
            alert('Error saving record');
        }
    };

    // Chart Data
    const chartData = {
        labels: [...history].reverse().map(h => new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Bench Press',
                data: [...history].reverse().map(h => h.metrics.benchPress),
                borderColor: '#ef4444', // Red
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                tension: 0.3
            },
            {
                label: 'Squat',
                data: [...history].reverse().map(h => h.metrics.squat),
                borderColor: '#3b82f6', // Blue
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3
            },
            {
                label: 'Deadlift',
                data: [...history].reverse().map(h => h.metrics.deadlift),
                borderColor: '#10b981', // Green
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                tension: 0.3
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#9ca3af' } } },
        scales: {
            y: { grid: { color: '#374151' }, ticks: { color: '#9ca3af' } },
            x: { grid: { color: '#374151' }, ticks: { color: '#9ca3af' } }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Loading Stats...</div>;

    return (
        <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <FaDumbbell className="text-red-500" /> Gym Stats
                </h1>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-transform hover:scale-105"
                >
                    <FaPlus /> {showForm ? 'Cancel' : 'Log New PR'}
                </button>
            </div>

            {/* Input Form */}
            {showForm && (
                <div className="bg-gray-800 p-6 rounded-2xl mb-8 border border-gray-700 animate-fade-in shadow-2xl">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Log Personal Record</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">Bench Press (kg)</label>
                            <input type="number" placeholder="0" className="w-full p-3 bg-gray-900 rounded-lg border border-gray-600 text-white focus:border-red-500 outline-none"
                                value={formData.benchPress} onChange={e => setFormData({...formData, benchPress: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">Squat (kg)</label>
                            <input type="number" placeholder="0" className="w-full p-3 bg-gray-900 rounded-lg border border-gray-600 text-white focus:border-blue-500 outline-none"
                                value={formData.squat} onChange={e => setFormData({...formData, squat: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">Deadlift (kg)</label>
                            <input type="number" placeholder="0" className="w-full p-3 bg-gray-900 rounded-lg border border-gray-600 text-white focus:border-green-500 outline-none"
                                value={formData.deadlift} onChange={e => setFormData({...formData, deadlift: e.target.value})} />
                        </div>
                        <button type="submit" className="col-span-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold mt-4 shadow-lg">Save Stats</button>
                    </form>
                </div>
            )}

            {/* Chart */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl mb-8 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-gray-200">Performance History</h3>
                <div className="h-72 md:h-96 w-full">
                    {history.length > 0 ? (
                        <Line options={chartOptions} data={chartData} />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">No data yet. Log your first workout!</div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700 flex items-center gap-2">
                    <FaClipboardList className="text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-200">Recent Logs</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50 text-gray-400 text-sm uppercase">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-red-400">Bench</th>
                                <th className="p-4 text-blue-400">Squat</th>
                                <th className="p-4 text-green-400">Deadlift</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {history.map((rec) => (
                                <tr key={rec._id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="p-4 text-gray-300">{new Date(rec.date).toLocaleDateString()}</td>
                                    <td className="p-4 font-mono font-bold text-white">{rec.metrics.benchPress || '-'}</td>
                                    <td className="p-4 font-mono font-bold text-white">{rec.metrics.squat || '-'}</td>
                                    <td className="p-4 font-mono font-bold text-white">{rec.metrics.deadlift || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GymStatsPage;