import React, { useState } from 'react';
import api from '../api/api';
import { FaLock, FaSave } from 'react-icons/fa';

const ChangePasswordForm = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', msg: 'New passwords do not match' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setStatus({ type: 'error', msg: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await api.post('/auth/change-password', {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });
            setStatus({ type: 'success', msg: res.data.msg });
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setStatus({ 
                type: 'error', 
                msg: err.response?.data?.msg || 'Failed to change password' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                <FaLock className="mr-2 text-gray-600" /> Change Password
            </h2>

            {status.msg && (
                <div className={`p-3 mb-4 rounded ${
                    status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                    {status.msg}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Current Password</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-200"
                >
                    {loading ? 'Updating...' : <><FaSave className="mr-2" /> Update Password</>}
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordForm;