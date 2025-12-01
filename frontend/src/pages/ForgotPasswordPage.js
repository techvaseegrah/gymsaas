import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // THIS LINE MUST MATCH THE BACKEND ROUTE
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.msg || 'Email sent successfully.');
        } catch (err) {
            // If this returns 404, it means the route above doesn't exist on the server
            setError(err.response?.data?.msg || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
                    <p className="text-gray-400">Enter your email to receive a reset link</p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-xl text-green-200 text-center">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-200 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-red-400 hover:text-red-300 font-medium"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;