import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

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
        country: ''
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
                // Redirect to the tenant's login page using the slug
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
            <div className="max-w-2xl w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Create Your Gym
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Set up your gym management system
                    </p>
                </div>
                
                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">Gym created successfully! Redirecting to login page...</span>
                    </div>
                )}
                
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        {/* Gym Information */}
                        <div className="sm:col-span-6">
                            <h3 className="text-lg font-medium text-white mb-4">Gym Information</h3>
                        </div>
                        
                        <div className="sm:col-span-3">
                            <label htmlFor="gymName" className="block text-sm font-medium text-gray-300">
                                Gym Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="gymName"
                                    name="gymName"
                                    type="text"
                                    required
                                    value={gymName}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        <div className="sm:col-span-3">
                            <label htmlFor="gymSlug" className="block text-sm font-medium text-gray-300">
                                Gym URL Slug
                            </label>
                            <div className="mt-1">
                                <input
                                    id="gymSlug"
                                    name="gymSlug"
                                    type="text"
                                    required
                                    value={gymSlug}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    This will be your gym's unique identifier in the URL
                                </p>
                            </div>
                        </div>
                        
                        {/* Admin Credentials */}
                        <div className="sm:col-span-6">
                            <h3 className="text-lg font-medium text-white mb-4 mt-6">Admin Credentials</h3>
                        </div>
                        
                        <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Admin Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        <div className="sm:col-span-3">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        <div className="sm:col-span-3">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        <div className="sm:col-span-3">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        {/* Address Information */}
                        <div className="sm:col-span-6">
                            <h3 className="text-lg font-medium text-white mb-4 mt-6">Gym Address</h3>
                        </div>
                        
                        <div className="sm:col-span-6">
                            <label htmlFor="street" className="block text-sm font-medium text-gray-300">
                                Street Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="street"
                                    name="street"
                                    type="text"
                                    value={street}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        <div className="sm:col-span-2">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-300">
                                City
                            </label>
                            <div className="mt-1">
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    value={city}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        <div className="sm:col-span-2">
                            <label htmlFor="state" className="block text-sm font-medium text-gray-300">
                                State / Province
                            </label>
                            <div className="mt-1">
                                <input
                                    id="state"
                                    name="state"
                                    type="text"
                                    value={state}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        <div className="sm:col-span-2">
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300">
                                ZIP / Postal Code
                            </label>
                            <div className="mt-1">
                                <input
                                    id="zipCode"
                                    name="zipCode"
                                    type="text"
                                    value={zipCode}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        <div className="sm:col-span-6">
                            <label htmlFor="country" className="block text-sm font-medium text-gray-300">
                                Country
                            </label>
                            <div className="mt-1">
                                <input
                                    id="country"
                                    name="country"
                                    type="text"
                                    value={country}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                                Already have an account?
                            </Link>
                        </div>
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                            {loading ? 'Creating Gym...' : 'Create Gym'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TenantSignupPage;