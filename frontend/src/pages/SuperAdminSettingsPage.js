import React, { useState, useEffect } from 'react';
import SuperAdminPageTemplate from '../components/SuperAdminPageTemplate';
import { FaCogs } from 'react-icons/fa';
import api from '../api/api';
import { exportToExcel } from '../utils/exportUtils';

const SuperAdminSettingsPage = () => {
    const [settings, setSettings] = useState({
        platformName: 'Mutants Academy',
        supportEmail: 'support@mutantsacademy.com',
        maintenanceMode: false,
        autoBackup: true,
        notificationEmails: true,
        version: 'v2.1.4',
        lastBackup: '2023-06-18 14:30 UTC',
        uptime: '99.98%'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/superadmin/settings');
                setSettings(res.data);
            } catch (err) {
                console.error('Failed to fetch settings:', err);
                setMessage('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        
        try {
            // Extract only the editable settings
            const { platformName, supportEmail, maintenanceMode, autoBackup, notificationEmails } = settings;
            await api.post('/superadmin/settings', { platformName, supportEmail, maintenanceMode, autoBackup, notificationEmails });
            setMessage('Settings saved successfully!');
        } catch (err) {
            console.error('Failed to save settings:', err);
            setMessage('Failed to save settings');
        } finally {
            setSaving(false);
            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleExportSettings = () => {
        const exportData = [{
            'Platform Name': settings.platformName,
            'Support Email': settings.supportEmail,
            'Maintenance Mode': settings.maintenanceMode ? 'On' : 'Off',
            'Automatic Backups': settings.autoBackup ? 'On' : 'Off',
            'Notification Emails': settings.notificationEmails ? 'On' : 'Off',
            'Version': settings.version,
            'Last Backup': settings.lastBackup,
            'Uptime': settings.uptime
        }];

        exportToExcel(exportData, 'system-settings', 'Settings');
    };

    if (loading) {
        return (
            <SuperAdminPageTemplate 
                title="System Settings" 
                subtitle="Configure platform-wide settings"
                icon={FaCogs}
                onExport={handleExportSettings}
            >
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400">Loading settings...</div>
                </div>
            </SuperAdminPageTemplate>
        );
    }

    return (
        <SuperAdminPageTemplate 
            title="System Settings" 
            subtitle="Configure platform-wide settings"
            icon={FaCogs}
            onExport={handleExportSettings}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <h3 className="text-lg font-bold mb-6 text-gray-200">General Settings</h3>
                        {message && (
                            <div className={`mb-4 p-3 rounded-lg ${message.includes('Failed') ? 'bg-red-900/30 text-red-200' : 'bg-green-900/30 text-green-200'}`}>
                                {message}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Platform Name
                                </label>
                                <input
                                    type="text"
                                    name="platformName"
                                    value={settings.platformName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Support Email
                                </label>
                                <input
                                    type="email"
                                    name="supportEmail"
                                    value={settings.supportEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="maintenanceMode"
                                        checked={settings.maintenanceMode}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                    />
                                    <label className="ml-2 text-gray-300">
                                        Maintenance Mode
                                    </label>
                                </div>
                                
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="autoBackup"
                                        checked={settings.autoBackup}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                    />
                                    <label className="ml-2 text-gray-300">
                                        Automatic Backups
                                    </label>
                                </div>
                                
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="notificationEmails"
                                        checked={settings.notificationEmails}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                    />
                                    <label className="ml-2 text-gray-300">
                                        Notification Emails
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`px-6 py-3 font-bold rounded-lg transition-colors ${saving ? 'bg-purple-800 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                                >
                                    {saving ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div>
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
                        <h3 className="text-lg font-bold mb-4 text-gray-200">System Info</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-400 text-sm">Version</p>
                                <p className="text-white font-medium">{settings.version}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Last Backup</p>
                                <p className="text-white font-medium">{settings.lastBackup}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Uptime</p>
                                <p className="text-green-400 font-medium">{settings.uptime}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <h3 className="text-lg font-bold mb-4 text-gray-200">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-left">
                                Clear Cache
                            </button>
                            <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-left">
                                Run Diagnostics
                            </button>
                            <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-left">
                                Restart Services
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminPageTemplate>
    );
};

export default SuperAdminSettingsPage;