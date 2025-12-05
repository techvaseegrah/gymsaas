import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { FiArrowRight, FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiHome, FiGlobe } from 'react-icons/fi';

const TenantSignupPage = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        gymName: '',
        gymSlug: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    
    const {
        gymName,
        gymSlug,
        email,
        password,
        confirmPassword,
        phone,
        street,
        city,
        state,
        zipCode,
        country
    } = formData;
    
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        
        // Auto-generate slug from gym name
        if (e.target.name === 'gymName') {
            const slug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, gymSlug: slug }));
        }
    };
    
    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const address = {
                street,
                city,
                state,
                zipCode,
                country
            };
            
            const res = await api.post('/tenants/signup', {
                gymName,
                gymSlug,
                email,
                password,
                phone,
                address
            });
            
            // Save token and redirect to tenant login page
            localStorage.setItem('token', res.data.token);
            setSuccess(true);
            
            // Redirect to tenant login page after a short delay
            setTimeout(() => {
                navigate(`/login?gym=${res.data.tenant.slug}`);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred during signup');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl">
                {/* Card */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-accent/20 border border-white/20 flex items-center justify-center font-bold text-white">
                                GR
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create Your Gym</h1>
                        <p className="text-gray-300">Set up your gym management system</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-900/30 border border-red-700 rounded px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 bg-green-900/30 border border-green-700 rounded px-4 py-3 text-sm text-green-200">
                            Gym created successfully! Redirecting to login page...
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Gym Information Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <FiGlobe className="text-accent" /> Gym Information
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="gymName" className="block text-sm font-medium text-gray-300 mb-2">
                                        Gym Name
                                    </label>
                                    <div className="relative">
                                        <FiHome className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            id="gymName"
                                            name="gymName"
                                            value={gymName}
                                            onChange={onChange}
                                            required
                                            className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                            placeholder="Enter your gym name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="gymSlug" className="block text-sm font-medium text-gray-300 mb-2">
                                        Gym URL Slug
                                    </label>
                                    <div className="relative">
                                        <FiGlobe className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            id="gymSlug"
                                            name="gymSlug"
                                            value={gymSlug}
                                            onChange={onChange}
                                            required
                                            className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                            placeholder="your-gym-name"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Account Section */}
                        <div className="space-y-4 pt-4 border-t border-gray-700">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <FiUser className="text-accent" /> Admin Account
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Admin Email
                                    </label>
                                    <div className="relative">
                                        <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={onChange}
                                            required
                                            className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                            placeholder="admin@yourgym.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={phone}
                                            onChange={onChange}
                                            className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={onChange}
                                            required
                                            className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                            placeholder="Create a strong password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={onChange}
                                            required
                                            className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gym Address Section */}
                        <div className="space-y-4 pt-4 border-t border-gray-700">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <FiMapPin className="text-accent" /> Gym Address
                            </h2>
                            
                            <div>
                                <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-2">
                                    Street Address
                                </label>
                                <div className="relative">
                                    <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        id="street"
                                        name="street"
                                        value={street}
                                        onChange={onChange}
                                        className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                        placeholder="123 Main Street"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={city}
                                        onChange={onChange}
                                        className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                        placeholder="City"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
                                        State / Province
                                    </label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={state}
                                        onChange={onChange}
                                        className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                        placeholder="State"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-2">
                                        ZIP / Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={zipCode}
                                        onChange={onChange}
                                        className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                        placeholder="ZIP Code"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={country}
                                    onChange={onChange}
                                    className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                    placeholder="Country"
                                />
                            </div>
                        </div>

                        {/* Submit Section */}
                        <div className="pt-6 border-t border-gray-700">
                            <div className="mb-4 text-center">
                                <Link 
                                    to="/login" 
                                    className="text-sm text-accent hover:text-accent/80 font-medium"
                                >
                                    Already have an account?
                                </Link>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating Gym...
                                    </>
                                ) : (
                                    <>
                                        Create Gym
                                        <FiArrowRight />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TenantSignupPage;