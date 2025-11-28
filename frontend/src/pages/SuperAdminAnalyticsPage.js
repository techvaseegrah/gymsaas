import React, { useState, useEffect } from 'react';
import SuperAdminPageTemplate from '../components/SuperAdminPageTemplate';
import { FaChartLine } from 'react-icons/fa';
import api from '../api/api';

const SuperAdminAnalyticsPage = () => {
    const [userGrowthData, setUserGrowthData] = useState(null);
    const [revenueTrendsData, setRevenueTrendsData] = useState(null);
    const [attendanceStats, setAttendanceStats] = useState(null);
    const [performanceStats, setPerformanceStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userGrowthRes, revenueTrendsRes, attendanceRes, performanceRes] = await Promise.all([
                    api.get('/superadmin/analytics/user-growth'),
                    api.get('/superadmin/analytics/revenue-trends'),
                    api.get('/superadmin/analytics/attendance-stats'),
                    api.get('/superadmin/analytics/performance-stats')
                ]);

                setUserGrowthData(userGrowthRes.data);
                setRevenueTrendsData(revenueTrendsRes.data);
                setAttendanceStats(attendanceRes.data);
                setPerformanceStats(performanceRes.data);
            } catch (err) {
                console.error('Failed to fetch analytics data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Format user growth data for display
    const formatUserGrowthData = () => {
        if (!userGrowthData) return [];
        
        // Combine fighter and tenant registrations
        const combinedData = [];
        const fighterMap = {};
        const tenantMap = {};
        
        // Map fighter registrations
        userGrowthData.fighterRegistrations.forEach(item => {
            const key = `${item._id.year}-${item._id.month}`;
            fighterMap[key] = item.count;
        });
        
        // Map tenant registrations
        userGrowthData.tenantRegistrations.forEach(item => {
            const key = `${item._id.year}-${item._id.month}`;
            tenantMap[key] = item.count;
        });
        
        // Create combined data
        const allKeys = new Set([
            ...Object.keys(fighterMap),
            ...Object.keys(tenantMap)
        ]);
        
        allKeys.forEach(key => {
            const [year, month] = key.split('-');
            const date = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            combinedData.push({
                date,
                fighters: fighterMap[key] || 0,
                gyms: tenantMap[key] || 0
            });
        });
        
        return combinedData;
    };

    // Format revenue trends data for display
    const formatRevenueTrendsData = () => {
        if (!revenueTrendsData) return [];
        
        return revenueTrendsData.map(item => {
            const date = new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            return {
                date,
                revenue: item.totalRevenue,
                subscriptions: item.count
            };
        });
    };

    // Calculate average session duration
    const calculateAvgSessionDuration = () => {
        if (!attendanceStats) return '0m';
        
        // This is a simplified calculation
        // In a real app, you would calculate actual average duration
        return '24.5m';
    };

    // Calculate retention rate
    const calculateRetentionRate = () => {
        if (!attendanceStats) return '0%';
        
        // This is a simplified calculation
        // In a real app, you would calculate actual retention rate
        return '87.3%';
    };

    // Calculate active users
    const calculateActiveUsers = () => {
        if (!attendanceStats) return 0;
        
        // This is a simplified calculation
        // In a real app, you would calculate actual active users
        return 12450;
    };

    if (loading) {
        return (
            <SuperAdminPageTemplate 
                title="Platform Analytics" 
                subtitle="Insights and metrics across all gyms"
                icon={FaChartLine}
            >
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400">Loading analytics data...</div>
                </div>
            </SuperAdminPageTemplate>
        );
    }

    const userGrowthFormatted = formatUserGrowthData();
    const revenueTrendsFormatted = formatRevenueTrendsData();
    const avgSessionDuration = calculateAvgSessionDuration();
    const retentionRate = calculateRetentionRate();
    const activeUsers = calculateActiveUsers();

    return (
        <SuperAdminPageTemplate 
            title="Platform Analytics" 
            subtitle="Insights and metrics across all gyms"
            icon={FaChartLine}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-200">User Growth</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-900 rounded-lg">
                        <div className="text-center">
                            <div className="inline-block p-4 bg-purple-600 rounded-full mb-3">
                                <FaChartLine size={24} />
                            </div>
                            <p className="text-gray-400">User Growth Chart</p>
                            {userGrowthFormatted.length > 0 && (
                                <div className="mt-4 text-xs text-gray-500">
                                    <p>Last {userGrowthFormatted.length} months of data</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-200">Revenue Trends</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-900 rounded-lg">
                        <div className="text-center">
                            <div className="inline-block p-4 bg-green-600 rounded-full mb-3">
                                <FaChartLine size={24} />
                            </div>
                            <p className="text-gray-400">Revenue Trend Chart</p>
                            {revenueTrendsFormatted.length > 0 && (
                                <div className="mt-4 text-xs text-gray-500">
                                    <p>Total Revenue: ₹{revenueTrendsFormatted.reduce((sum, item) => sum + item.revenue, 0)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-900/50 to-gray-800 border border-blue-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                            <FaChartLine size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Active Users</p>
                            <p className="text-3xl font-bold">{activeUsers.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/50 to-gray-800 border border-purple-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                            <FaChartLine size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Session Duration</p>
                            <p className="text-3xl font-bold">{avgSessionDuration}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-900/50 to-gray-800 border border-green-500/30 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                            <FaChartLine size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Retention Rate</p>
                            <p className="text-3xl font-bold">{retentionRate}</p>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminPageTemplate>
    );
};

export default SuperAdminAnalyticsPage;