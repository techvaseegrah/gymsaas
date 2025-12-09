import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

// --- Import Pages ---
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import TenantSignupPage from './pages/TenantSignupPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import DashboardPage from './pages/DashboardPage'; // Stats Dashboard
import AddFighterPage from './pages/AddFighterPage';
import EditFighterPage from './pages/EditFighterPage';
import ViewFighterDetailsPage from './pages/ViewFighterDetailsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminAttendancePage from './pages/AdminAttendancePage';
import AdminSubscriptionPage from './pages/AdminSubscriptionPage';
import AskDoubtPage from './pages/AskDoubtPage';

// Fighter Pages
import FighterHomePage from './pages/FighterHomePage';
import FighterAttendancePage from './pages/FighterAttendancePage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import FighterFaceRecognitionPage from './pages/FighterFaceRecognitionPage';
import FighterProfileUpdatePage from './pages/FighterProfileUpdatePage';
import SubscriptionDetailsPage from './pages/SubscriptionDetailsPage';
import GymStatsPage from './pages/GymStatsPage';

// --- SUPER ADMIN PAGES ---
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage';
import SuperAdminLoginPage from './pages/SuperAdminLoginPage';
import SuperAdminGymsPage from './pages/SuperAdminGymsPage';
import SuperAdminCreateGymPage from './pages/SuperAdminCreateGymPage';
import SuperAdminUsersPage from './pages/SuperAdminUsersPage';
import SuperAdminBillingPage from './pages/SuperAdminBillingPage';
import SuperAdminAnalyticsPage from './pages/SuperAdminAnalyticsPage';
import SuperAdminSettingsPage from './pages/SuperAdminSettingsPage';
import SuperAdminContactMessagesPage from './pages/SuperAdminContactMessagesPage';

// Password Reset Pages
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// --- Import Components ---
import AdminSidebar from './components/AdminSidebar';
import FighterSidebar from './components/FighterSidebar';
import SuperAdminSidebar from './components/SuperAdminSidebar';

import api from './api/api';

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/user');
                    setUser(data);
                } catch (error) {
                    console.error("Session expired or token is invalid.");
                    try {
                        await api.post('/auth/refresh');
                        const { data } = await api.get('/auth/user');
                        setUser(data);
                    } catch (refreshError) {
                        console.error("Token refresh failed.");
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/';
    };
    
    const confirmLogout = () => { setShowLogoutConfirm(true); };
    const performLogout = () => { handleLogout(); setShowLogoutConfirm(false); };
    const cancelLogout = () => { setShowLogoutConfirm(false); };
    
    // --- SECURITY GATEKEEPER ---
    const ProtectedRoute = ({ children, role }) => {
        const location = useLocation();

        if (loading) return null;

        if (!user) {
            const token = localStorage.getItem('token');
            if (token) {
                return <Navigate to="/superadmin/login" replace />;
            }
            return <Navigate to="/login" replace />;
        }
        
        if (role && user.role !== role) {
            return <Navigate to="/" replace />;
        }

        if (user.role === 'fighter' && !user.profile_completed) {
            if (location.pathname !== '/fighter/complete-profile') {
                return <Navigate to="/fighter/complete-profile" replace />;
            }
        }
        
        if (user.role === 'fighter' && user.profile_completed && location.pathname === '/fighter/complete-profile') {
             return <Navigate to="/fighter" replace />;
        }

        return children;
    };

    // --- LAYOUTS (UPDATED FOR DARK THEME) ---

    // 1. Regular Admin Layout (Gym Owners)
    const AdminLayout = ({ children }) => {
        const [isSidebarOpen, setSidebarOpen] = useState(false);
        const closeSidebar = () => setSidebarOpen(false);
        return (
            // CHANGED: bg-gray-100 -> bg-[#0a0a0a]
            <div className="relative min-h-screen bg-[#0a0a0a]">
                {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black/80 backdrop-blur-sm lg:hidden" onClick={closeSidebar}></div>}
                
                {/* Mobile Header */}
                <div className="lg:hidden flex justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-md text-white p-4 sticky top-0 z-10 border-b border-white/10">
                    <h1 className="text-xl font-bold text-cyan-400">Combat OS</h1>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-300">
                        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-transparent text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
                    <AdminSidebar handleLogout={confirmLogout} closeSidebar={closeSidebar} user={user} />
                </aside>
                
                {/* Main Content Area */}
                <main className="lg:ml-64 min-h-screen relative">
                    {/* Optional: Add global background blobs here if needed for consistency */}
                    {children}
                </main>
                <LogoutModal />
            </div>
        );
    };

    // 2. Fighter Layout
    const FighterLayout = ({ children }) => {
        const [isSidebarOpen, setSidebarOpen] = useState(false);
        const closeSidebar = () => setSidebarOpen(false);
        return (
            // CHANGED: bg-gray-900 -> bg-[#0a0a0a]
            <div className="relative min-h-screen bg-[#0a0a0a]">
                {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black/80 backdrop-blur-sm lg:hidden" onClick={closeSidebar}></div>}
                <div className="lg:hidden flex justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-md text-white p-4 sticky top-0 z-10 border-b border-white/10">
                    <h1 className="text-xl font-bold text-cyan-400">Fighter Portal</h1>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-300">
                        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
                <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0a0a0a] text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-white/10`}>
                    <FighterSidebar handleLogout={confirmLogout} closeSidebar={closeSidebar} user={user} />
                </aside>
                <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen">{children}</main>
                <LogoutModal />
            </div>
        );
    };

    // 3. Super Admin Layout
    const SuperAdminLayout = ({ children }) => {
        const [isSidebarOpen, setSidebarOpen] = useState(false);
        const closeSidebar = () => setSidebarOpen(false);
        return (
            // CHANGED: bg-gray-900 -> bg-[#0a0a0a]
            <div className="relative min-h-screen bg-[#0a0a0a]">
                {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black/80 backdrop-blur-sm lg:hidden" onClick={closeSidebar}></div>}
                <div className="lg:hidden flex justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-md text-white p-4 sticky top-0 z-10 border-b border-white/10">
                    <h1 className="text-xl font-bold text-cyan-400">Super Admin</h1>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-300">
                        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
                <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0a0a0a] text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-white/10`}>
                    <SuperAdminSidebar handleLogout={confirmLogout} closeSidebar={closeSidebar} />
                </aside>
                <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen">{children}</main>
                <LogoutModal />
            </div>
        );
    };

    // Helper Component for Logout Modal (Dark Themed)
    const LogoutModal = () => (
        showLogoutConfirm && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-80 sm:w-96 text-white shadow-2xl">
                    <h3 className="text-xl font-bold mb-4 text-white">Disconnect?</h3>
                    <p className="mb-8 text-slate-400">Are you sure you want to log out of Combat OS?</p>
                    <div className="flex justify-end space-x-3">
                        <button onClick={cancelLogout} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors">Cancel</button>
                        <button onClick={performLogout} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors font-medium">Logout</button>
                    </div>
                </div>
            </div>
        )
    );

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white"><div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div></div>;
    }

    return (
        <Router>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage setUser={setUser} user={user} />} />
                <Route path="/signup" element={<TenantSignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />

                {/* --- SUPER ADMIN ROUTES --- */}
                <Route path="/superadmin/login" element={<SuperAdminLoginPage setUser={setUser} />} />

                <Route 
                    path="/superadmin/*" 
                    element={
                        <ProtectedRoute role="superadmin">
                            <SuperAdminLayout>
                                <Routes>
                                    <Route path="dashboard" element={<SuperAdminDashboardPage />} />
                                    <Route path="gyms" element={<SuperAdminGymsPage />} />
                                    <Route path="gyms/create" element={<SuperAdminCreateGymPage />} />
                                    <Route path="users" element={<SuperAdminUsersPage />} />
                                    <Route path="billing" element={<SuperAdminBillingPage />} />
                                    <Route path="settings" element={<SuperAdminSettingsPage />} />
                                    <Route path="contact-messages" element={<SuperAdminContactMessagesPage />} />
                                    <Route path="analytics" element={<SuperAdminAnalyticsPage />} />
                                    <Route path="tenants*" element={<Navigate to="/superadmin/gyms" replace />} />
                                    <Route path="*" element={<Navigate to="/superadmin/dashboard" />} />
                                </Routes>
                            </SuperAdminLayout>
                        </ProtectedRoute>
                    } 
                />

                {/* --- ADMIN ROUTES --- */}
                <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminLayout><AdminDashboardPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout><AdminDashboardPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/add-fighter" element={<ProtectedRoute role="admin"><AdminLayout><AddFighterPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/edit-fighter/:id" element={<ProtectedRoute role="admin"><AdminLayout><EditFighterPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/fighter/:id" element={<ProtectedRoute role="admin"><AdminLayout><ViewFighterDetailsPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/attendance" element={<ProtectedRoute role="admin"><AdminLayout><AdminAttendancePage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminLayout><AdminSettingsPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/subscriptions" element={<ProtectedRoute role="admin"><AdminLayout><AdminSubscriptionPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/ask-doubt" element={<ProtectedRoute role="admin"><AdminLayout><AskDoubtPage /></AdminLayout></ProtectedRoute>} />
                
                {/* --- FIGHTER ROUTES --- */}
                <Route path="/fighter/stats" element={<ProtectedRoute role="fighter"><FighterLayout><GymStatsPage /></FighterLayout></ProtectedRoute>} />
                <Route path="/fighter/attendance/face" element={<ProtectedRoute role="fighter"><FighterLayout><FighterFaceRecognitionPage /></FighterLayout></ProtectedRoute>} />
                <Route path="/fighter/ask-doubt" element={<ProtectedRoute role="fighter"><FighterLayout><AskDoubtPage /></FighterLayout></ProtectedRoute>} />
                <Route path="/fighter/complete-profile" element={<ProtectedRoute role="fighter"><CompleteProfilePage /></ProtectedRoute>} />
                <Route path="/fighter" element={<ProtectedRoute role="fighter"><FighterLayout><FighterHomePage user={user} confirmLogout={confirmLogout} /></FighterLayout></ProtectedRoute>} />
                <Route path="/fighter/attendance" element={<ProtectedRoute role="fighter"><FighterLayout><FighterAttendancePage user={user} /></FighterLayout></ProtectedRoute>} />
                <Route path="/fighter/profile/update" element={<ProtectedRoute role="fighter"><FighterLayout><FighterProfileUpdatePage /></FighterLayout></ProtectedRoute>} />
                <Route path="/fighter/subscription-details" element={<ProtectedRoute role="fighter"><FighterLayout><SubscriptionDetailsPage /></FighterLayout></ProtectedRoute>} />

                {/* Catch all - Redirect to Landing */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;