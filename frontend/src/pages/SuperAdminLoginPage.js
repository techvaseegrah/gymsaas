import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { FaLock, FaUserShield } from 'react-icons/fa';

const SuperAdminLoginPage = ({ setUser }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { email, password } = formData;

    // Check if there's a valid token on page load
    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Try to get user data with current token
                    const res = await api.get('/auth/user');
                    setUser(res.data);
                    navigate('/superadmin/dashboard');
                } catch (err) {
                    // Token might be expired, continue to login form
                    console.log('Token expired or invalid, showing login form');
                }
            }
        };
        checkToken();
    }, [navigate, setUser]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', {
                email,
                password,
                role: 'superadmin'
            });

            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/superadmin/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-8 text-center bg-gradient-to-r from-purple-900/50 to-gray-900/50 border-b border-gray-700">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                                <FaUserShield className="text-2xl text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Super Admin</h1>
                        <p className="text-gray-400">Secure Control Panel Access</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-center text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                                    placeholder="superadmin@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <FaLock className="absolute right-3 top-3.5 text-gray-500" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Authenticating...
                                    </div>
                                ) : (
                                    'Access Control Panel'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-gray-900/50 border-t border-gray-700 text-center">
                        <p className="text-gray-500 text-sm">
                            Authorized personnel only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminLoginPage;