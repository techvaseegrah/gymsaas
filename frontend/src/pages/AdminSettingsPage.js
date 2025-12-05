import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaMapMarkerAlt, FaLock, FaEnvelope, FaSave, FaSatelliteDish, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

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
                const res = await api.get(`/settings?t=${new Date().getTime()}`);
                setLocation({
                    latitude: res.data.location?.latitude !== undefined ? parseFloat(res.data.location.latitude) : 12.9716,
                    longitude: res.data.location?.longitude !== undefined ? parseFloat(res.data.location.longitude) : 77.5946,
                    radius: res.data.location?.radius ? parseInt(res.data.location.radius) : 100,
                    enabled: res.data.location?.enabled !== undefined ? Boolean(res.data.location.enabled) : true
                });
            } catch (err) {
                console.error('Error fetching settings:', err);
                setLocation({ latitude: 12.9716, longitude: 77.5946, radius: 100, enabled: true });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // --- HANDLERS (Same Logic, Just UI Changes) ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setLocation({ ...location, [name]: checked });
        } else {
            setLocation({ ...location, [name]: value });
        }
    };

    const handleUseCurrentLocation = () => {
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
                setMessage('Location fetched from device.');
            },
            (error) => setMessage('Unable to retrieve location.')
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSaving(true);
        try {
            // (Keep your existing validation logic here if needed)
            const dataToSend = { ...location, radius: parseInt(location.radius) };
            const response = await api.post('/settings', { location: dataToSend });
            setMessage(response.data.msg);
        } catch (err) {
            setMessage(`Error: ${err.response?.data?.msg || err.message}`);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    const handleEmailChange = (e) => setEmailForm({ ...emailForm, [e.target.name]: e.target.value });

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsChangingPassword(true);
        try {
            if (passwordForm.newPassword !== passwordForm.confirmNewPassword) throw new Error("Passwords do not match");
            const res = await api.post('/auth/change-password', { 
                oldPassword: passwordForm.currentPassword, 
                newPassword: passwordForm.newPassword
            });
            setPasswordMessage(res.data.msg);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            setPasswordMessage(err.response?.data?.msg || err.message);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsChangingEmail(true);
        try {
            if (emailForm.newEmail !== emailForm.confirmNewEmail) throw new Error("Emails do not match");
            const res = await api.put('/auth/change-email', {
                newEmail: emailForm.newEmail,
                password: emailForm.password
            });
            setEmailMessage(res.data.msg);
            setEmailForm({ newEmail: '', confirmNewEmail: '', password: '' });
        } catch (err) {
            setEmailMessage(err.response?.data?.msg || err.message);
        } finally {
            setIsChangingEmail(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading System Config...</div>;

    // --- REUSABLE STYLES ---
    const inputClass = "w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all";
    const labelClass = "block text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider";
    const glassCard = "glass-liquid rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:border-white/20 transition-colors";

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8 pb-20">
            <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">System Configuration</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* --- COL 1: GEOLOCATION --- */}
                <div className={glassCard}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                        <FaSatelliteDish className="text-9xl text-cyan-500" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                            <span className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400"><FaMapMarkerAlt /></span>
                            Geo-Fencing Core
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {message && <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-sm flex items-center gap-2"><FaCheckCircle /> {message}</div>}
                            
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div>
                                    <h3 className="font-semibold text-white">Active Enforcement</h3>
                                    <p className="text-xs text-slate-400">Lock attendance to coordinates</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="enabled"
                                        checked={location.enabled}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                                </label>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Latitude</label>
                                    <input type="number" name="latitude" value={location.latitude} onChange={handleChange} step="any" className={inputClass} disabled={!location.enabled} />
                                </div>
                                <div>
                                    <label className={labelClass}>Longitude</label>
                                    <input type="number" name="longitude" value={location.longitude} onChange={handleChange} step="any" className={inputClass} disabled={!location.enabled} />
                                </div>
                            </div>
                            
                            <div>
                                <label className={labelClass}>Allowed Radius: {location.radius}m</label>
                                <input 
                                    type="range" name="radius" value={location.radius} onChange={handleChange} min="50" max="500" step="10"
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                    disabled={!location.enabled}
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={handleUseCurrentLocation} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl border border-white/10 transition-all">
                                    Use GPS
                                </button>
                                <button type="submit" disabled={isSaving} className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                                    {isSaving ? 'Saving...' : 'Update Zone'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- COL 2: SECURITY --- */}
                <div className="space-y-8">
                    {/* Password */}
                    <div className={glassCard}>
                        <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                            <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><FaLock /></span>
                            Security Credentials
                        </h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            {passwordMessage && <div className="text-sm text-purple-300">{passwordMessage}</div>}
                            <input type="password" name="currentPassword" placeholder="Current Password" value={passwordForm.currentPassword} onChange={handlePasswordChange} className={inputClass} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="password" name="newPassword" placeholder="New Password" value={passwordForm.newPassword} onChange={handlePasswordChange} className={inputClass} />
                                <input type="password" name="confirmNewPassword" placeholder="Confirm" value={passwordForm.confirmNewPassword} onChange={handlePasswordChange} className={inputClass} />
                            </div>
                            <button type="submit" disabled={isChangingPassword} className="w-full bg-white/5 hover:bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold py-3 rounded-xl transition-all">
                                {isChangingPassword ? 'Updating...' : 'Change Password'}
                            </button>
                        </form>
                    </div>

                    {/* Email */}
                    <div className={glassCard}>
                        <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                            <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><FaEnvelope /></span>
                            Admin Contact
                        </h2>
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            {emailMessage && <div className="text-sm text-blue-300">{emailMessage}</div>}
                            <input type="email" name="newEmail" placeholder="New Email Address" value={emailForm.newEmail} onChange={handleEmailChange} className={inputClass} />
                            <input type="password" name="password" placeholder="Confirm with Password" value={emailForm.password} onChange={handleEmailChange} className={inputClass} />
                            <button type="submit" disabled={isChangingEmail} className="w-full bg-white/5 hover:bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold py-3 rounded-xl transition-all">
                                {isChangingEmail ? 'Updating...' : 'Update Email'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;