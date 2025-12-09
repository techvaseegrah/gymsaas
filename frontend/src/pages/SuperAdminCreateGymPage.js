import React, { useState } from 'react';
import SuperAdminPageTemplate from '../components/SuperAdminPageTemplate';
import { FaBuilding } from 'react-icons/fa';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const SuperAdminCreateGymPage = () => {
    const [formData, setFormData] = useState({
        gymName: '',
        gymSlug: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        plan: 'trial' // Default to Trial
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const { gymName, gymSlug, email, password, phone, address, plan } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!gymName || !gymSlug || !email || !password) {
            setError('Please fill in all required fields');
            return false;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(gymSlug)) {
            setError('Slug can only contain lowercase letters, numbers, and hyphens');
            return false;
        }
        
        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const res = await api.post('/superadmin/tenants', formData);
            setSuccess(res.data.msg);
            
            // Reset form
            setFormData({
                gymName: '',
                gymSlug: '',
                email: '',
                password: '',
                phone: '',
                address: '',
                plan: 'trial'
            });
            
            // Redirect to gyms list after 2 seconds
            setTimeout(() => {
                navigate('/superadmin/tenants');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create gym');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SuperAdminPageTemplate 
            title="Create New Gym" 
            subtitle="Manually onboard a new gym to the platform"
            icon={FaBuilding}
        >
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-2xl mx-auto">
                <form onSubmit={onSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-center text-sm">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-200 text-center text-sm">
                            {success}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Gym Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="gymName"
                                value={gymName}
                                onChange={onChange}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter gym name"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Gym Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="gymSlug"
                                value={gymSlug}
                                onChange={onChange}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="unique-gym-name"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Lowercase letters, numbers, and hyphens only</p>
                        </div>
                    </div>

                    {/* NEW PLAN SELECTION DROPDOWN */}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Assign Plan <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="plan"
                            value={plan}
                            onChange={onChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="trial">Free Trial (30 Days - Full Access)</option>
                            <option value="basic">Base Plan (Active)</option>
                            <option value="enterprise">Enterprise Plan (Active)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            "Active" plans will not expire automatically. "Trial" expires in 30 days.
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Admin Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="admin@gymname.com"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Admin Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="At least 6 characters"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={phone}
                            onChange={onChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter phone number"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Address
                        </label>
                        <textarea
                            name="address"
                            value={address}
                            onChange={onChange}
                            rows="3"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter gym address"
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/superadmin/tenants')}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 font-bold rounded-lg transition-colors ${
                                loading ? 'bg-purple-800 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                            } text-white`}
                        >
                            {loading ? 'Creating...' : 'Create Gym'}
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminPageTemplate>
    );
};

export default SuperAdminCreateGymPage;