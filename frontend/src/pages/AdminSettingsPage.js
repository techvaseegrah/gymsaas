import React, { useState, useEffect } from 'react';
import api from '../api/api';

const AdminSettingsPage = () => {
    // --- 1. LOCATION STATE ---
    const [location, setLocation] = useState({ 
        latitude: '', 
        longitude: '', 
        radius: 100, 
        enabled: true 
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // --- 2. PASSWORD CHANGE STATE ---
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [passwordMessage, setPasswordMessage] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    // --- 3. EMAIL CHANGE STATE ---
    const [emailForm, setEmailForm] = useState({
        newEmail: '',
        confirmNewEmail: '',
        password: ''
    });
    const [emailMessage, setEmailMessage] = useState('');
    const [isChangingEmail, setIsChangingEmail] = useState(false);

    // --- FETCH SETTINGS ON LOAD ---
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Add cache-busting timestamp to ensure fresh data
                const res = await api.get(`/settings?t=${new Date().getTime()}`);
                setLocation({
                    latitude: res.data.location?.latitude !== undefined ? parseFloat(res.data.location.latitude) : 12.9716,
                    longitude: res.data.location?.longitude !== undefined ? parseFloat(res.data.location.longitude) : 77.5946,
                    radius: res.data.location?.radius ? parseInt(res.data.location.radius) : 100,
                    enabled: res.data.location?.enabled !== undefined ? Boolean(res.data.location.enabled) : true
                });
            } catch (err) {
                console.error('Error fetching settings:', err);
                setLocation({ 
                    latitude: 12.9716, 
                    longitude: 77.5946, 
                    radius: 100, 
                    enabled: true 
                });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // --- LOCATION HANDLERS ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'number') {
            if (name === 'latitude' || name === 'longitude') {
                if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                    setLocation({ ...location, [name]: value });
                }
            } else if (name === 'radius') {
                if (value === '' || /^\d*$/.test(value)) {
                    setLocation({ ...location, [name]: value });
                }
            } else {
                if (value === '' || /^\d*$/.test(value)) {
                    setLocation({ ...location, [name]: value });
                }
            }
        } else if (type === 'checkbox') {
            setLocation({ ...location, [name]: checked });
        } else {
            setLocation({ ...location, [name]: value });
        }
    };

    const handleUseCurrentLocation = async () => {
        setMessage('');
        if (!navigator.geolocation) {
            setMessage('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    ...location,
                    latitude: parseFloat(position.coords.latitude.toFixed(6)),
                    longitude: parseFloat(position.coords.longitude.toFixed(6))
                });
                setMessage('Location updated successfully!');
            },
            (error) => {
                console.error('Error getting location:', error);
                setMessage('Unable to retrieve your location. Please try again.');
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSaving(true);
        try {
            if (location.enabled) {
                if ((!location.latitude && location.latitude !== 0) || (!location.longitude && location.longitude !== 0)) {
                    setMessage('Error: Latitude and longitude are required when enabled');
                    setIsSaving(false);
                    return;
                }
                
                const lat = parseFloat(location.latitude);
                const lng = parseFloat(location.longitude);
                
                if (isNaN(lat) || isNaN(lng)) {
                    setMessage('Error: Coordinates must be valid numbers');
                    setIsSaving(false);
                    return;
                }
                
                if (lat < -90 || lat > 90) {
                    setMessage('Error: Latitude must be between -90 and 90');
                    setIsSaving(false);
                    return;
                }
                
                if (lng < -180 || lng > 180) {
                    setMessage('Error: Longitude must be between -180 and 180');
                    setIsSaving(false);
                    return;
                }
            }
            
            const radius = parseInt(location.radius);
            if (isNaN(radius) || radius < 50 || radius > 500) {
                setMessage('Error: Radius must be between 50 and 500 meters');
                setIsSaving(false);
                return;
            }
            
            let dataToSend;
            if (location.enabled) {
                dataToSend = {
                    latitude: parseFloat(location.latitude),
                    longitude: parseFloat(location.longitude),
                    radius: radius,
                    enabled: location.enabled
                };
            } else {
                dataToSend = {
                    latitude: 0,
                    longitude: 0,
                    radius: radius,
                    enabled: location.enabled
                };
            }
            
            const response = await api.post('/settings', { location: dataToSend });
            setMessage(response.data.msg);
        } catch (err) {
            console.error('Error updating settings:', err);
            const errorMsg = err.response?.data?.msg || err.message || 'Error updating location.';
            setMessage(`Error: ${errorMsg}`);
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- PASSWORD CHANGE HANDLERS ---
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm({ ...passwordForm, [name]: value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage('');
        setIsChangingPassword(true);
        
        try {
            if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
                setPasswordMessage('Please fill in all fields');
                setIsChangingPassword(false);
                return;
            }
            
            if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
                setPasswordMessage('New passwords do not match');
                setIsChangingPassword(false);
                return;
            }
            
            if (passwordForm.newPassword.length < 6) {
                setPasswordMessage('New password must be at least 6 characters');
                setIsChangingPassword(false);
                return;
            }
            
            const response = await api.post('/auth/change-password', { 
                oldPassword: passwordForm.currentPassword, 
                newPassword: passwordForm.newPassword
            });
            
            setPasswordMessage(response.data.msg);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            console.error('Error changing password:', err);
            const errorMsg = err.response?.data?.msg || err.message || 'Error changing password.';
            setPasswordMessage(`Error: ${errorMsg}`);
        } finally {
            setIsChangingPassword(false);
        }
    };
    
    // --- EMAIL CHANGE HANDLERS ---
    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        setEmailForm({ ...emailForm, [name]: value });
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setEmailMessage('');
        setIsChangingEmail(true);
        
        try {
            if (!emailForm.newEmail || !emailForm.confirmNewEmail || !emailForm.password) {
                setEmailMessage('Please fill in all fields');
                setIsChangingEmail(false);
                return;
            }
            
            if (emailForm.newEmail !== emailForm.confirmNewEmail) {
                setEmailMessage('Email addresses do not match');
                setIsChangingEmail(false);
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailForm.newEmail)) {
                setEmailMessage('Please enter a valid email address');
                setIsChangingEmail(false);
                return;
            }
            
            const response = await api.put('/auth/change-email', {
                newEmail: emailForm.newEmail,
                password: emailForm.password
            });
            
            setEmailMessage(response.data.msg);
            setEmailForm({ newEmail: '', confirmNewEmail: '', password: '' });
        } catch (err) {
            console.error('Error changing email:', err);
            const errorMsg = err.response?.data?.msg || err.message || 'Error changing email.';
            setEmailMessage(`Error: ${errorMsg}`);
        } finally {
            setIsChangingEmail(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-center text-gray-500">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold">Loading Settings...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-red-600 pl-4">
                    Administration Settings
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* --- COL 1: LOCATION SETTINGS --- */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gray-800 py-4 px-6 border-b border-gray-700">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    📍 Location Verification
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {message && (
                                        <div className={`p-3 rounded-md text-sm font-medium ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {message}
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Enable Geofencing</h3>
                                            <p className="text-xs text-gray-500">Restrict attendance to gym premises</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                name="enabled"
                                                checked={location.enabled}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Latitude</label>
                                            <input 
                                                type="number" 
                                                name="latitude" 
                                                value={location.latitude} 
                                                onChange={handleChange} 
                                                step="any"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400" 
                                                required={location.enabled}
                                                disabled={!location.enabled}
                                                placeholder="e.g. 12.9716"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Longitude</label>
                                            <input 
                                                type="number" 
                                                name="longitude" 
                                                value={location.longitude} 
                                                onChange={handleChange} 
                                                step="any"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400" 
                                                required={location.enabled}
                                                disabled={!location.enabled}
                                                placeholder="e.g. 77.5946"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Allowed Radius (meters)</label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="range" 
                                                name="radius" 
                                                value={location.radius} 
                                                onChange={handleChange} 
                                                min="50" 
                                                max="500" 
                                                step="10"
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                disabled={!location.enabled}
                                            />
                                            <input 
                                                type="number" 
                                                name="radius" 
                                                value={location.radius} 
                                                onChange={handleChange} 
                                                className="w-20 px-2 py-1 text-center border border-gray-300 rounded-lg font-mono"
                                                disabled={!location.enabled}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <button 
                                            type="button" 
                                            onClick={handleUseCurrentLocation}
                                            className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                                            disabled={!location.enabled || isSaving}
                                        >
                                            Get Coordinates
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="flex-1 bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                                            disabled={isSaving}
                                        >
                                            {isSaving ? 'Saving...' : 'Save Location'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* --- COL 2: ACCOUNT SETTINGS --- */}
                    <div className="space-y-8">
                        
                        {/* Password Change Section */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-red-600 py-4 px-6 border-b border-red-700">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    🔒 Change Password
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    {passwordMessage && (
                                        <div className={`p-3 rounded-md text-sm font-medium ${passwordMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {passwordMessage}
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Current Password</label>
                                        <input 
                                            type="password" 
                                            name="currentPassword" 
                                            value={passwordForm.currentPassword} 
                                            onChange={handlePasswordChange} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                                        <input 
                                            type="password" 
                                            name="newPassword" 
                                            value={passwordForm.newPassword} 
                                            onChange={handlePasswordChange} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                                            required
                                            minLength="6"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            name="confirmNewPassword" 
                                            value={passwordForm.confirmNewPassword} 
                                            onChange={handlePasswordChange} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                                            required
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="w-full bg-gray-800 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50"
                                        disabled={isChangingPassword}
                                    >
                                        {isChangingPassword ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                        
                        {/* Email Change Section */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gray-700 py-4 px-6 border-b border-gray-800">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    ✉️ Update Email
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                <form onSubmit={handleEmailSubmit} className="space-y-4">
                                    {emailMessage && (
                                        <div className={`p-3 rounded-md text-sm font-medium ${emailMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {emailMessage}
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">New Email Address</label>
                                        <input 
                                            type="email" 
                                            name="newEmail" 
                                            value={emailForm.newEmail} 
                                            onChange={handleEmailChange} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Email</label>
                                        <input 
                                            type="email" 
                                            name="confirmNewEmail" 
                                            value={emailForm.confirmNewEmail} 
                                            onChange={handleEmailChange} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Current Password</label>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            value={emailForm.password} 
                                            onChange={handleEmailChange} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                            required
                                            placeholder="Verify your identity"
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                                        disabled={isChangingEmail}
                                    >
                                        {isChangingEmail ? 'Updating...' : 'Update Email'}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;