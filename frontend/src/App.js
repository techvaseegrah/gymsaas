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
// import FighterLevelPage from './pages/FighterLevelPage'; // Replaced by GymStatsPage

// Fighter Pages
import FighterHomePage from './pages/FighterHomePage';
import FighterAttendancePage from './pages/FighterAttendancePage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import FighterFaceRecognitionPage from './pages/FighterFaceRecognitionPage';
import FighterProfileUpdatePage from './pages/FighterProfileUpdatePage';
import SubscriptionDetailsPage from './pages/SubscriptionDetailsPage';
import GymStatsPage from './pages/GymStatsPage'; // NEW: Replaces FighterLevelViewPage

// Super Admin Pages
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage';

// Password Reset Pages
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SuperAdminLoginPage from './pages/SuperAdminLoginPage';

// --- Import Components ---
import AdminSidebar from './components/AdminSidebar';
import FighterSidebar from './components/FighterSidebar';
// import SuperAdminSidebar from './components/SuperAdminSidebar'; // If you created a separate one

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
                    setUser(null);
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

        if (loading) return null; // Wait for user check

        // 1. If not logged in -> Login Page
        if (!user) {
            return <Navigate to="/login" replace />;
        }
        
        // 2. If role doesn't match -> Kick out
        // (e.g. A 'fighter' trying to access a 'superadmin' route)
        if (role && user.role !== role) {
            return <Navigate to="/" replace />;
        }

        // 3. Fighter Specific Checks
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

    // --- LAYOUTS ---

    // 1. Regular Admin Layout (Gym Owners)
    const AdminLayout = ({ children }) => {
        const [isSidebarOpen, setSidebarOpen] = useState(false);
        const closeSidebar = () => setSidebarOpen(false);
        return (
            <div className="relative min-h-screen bg-gray-100">
                {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden" onClick={closeSidebar}></div>}
                <div className="lg:hidden flex justify-between items-center bg-gray-800 text-white p-4 sticky top-0 z-10">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
                <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
                    <AdminSidebar handleLogout={confirmLogout} closeSidebar={closeSidebar} />
                </aside>
                <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen">{children}</main>
                <LogoutModal />
            </div>
        );
    };

    // 2. Fighter Layout
    const FighterLayout = ({ children }) => {
        const [isSidebarOpen, setSidebarOpen] = useState(false);
        const closeSidebar = () => setSidebarOpen(false);
        return (
            <div className="relative min-h-screen bg-gray-900">
                {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden" onClick={closeSidebar}></div>}
                <div className="lg:hidden flex justify-between items-center bg-gray-800 text-white p-4 sticky top-0 z-10 border-b border-gray-700">
                    <h1 className="text-xl font-bold">Fighter Portal</h1>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
                <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-gray-700`}>
                    <FighterSidebar handleLogout={confirmLogout} closeSidebar={closeSidebar} />
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
            <div className="relative min-h-screen bg-gray-900">
                {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden" onClick={closeSidebar}></div>}
                <div className="lg:hidden flex justify-between items-center bg-gray-900 text-purple-400 p-4 sticky top-0 z-10 border-b border-gray-800">
                    <h1 className="text-xl font-bold">Super Admin</h1>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
                <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-gray-800`}>
                    <div className="flex flex-col h-full">
                        <div className="p-6 text-center border-b border-gray-800">
                            <h1 className="text-xl font-bold text-white tracking-wider">SUPER ADMIN</h1>
                            <p className="text-xs text-purple-400 mt-1">Control Panel</p>
                        </div>
                        <nav className="flex-grow px-4 py-6 space-y-2">
                            <a href="/superadmin/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                                Dashboard
                            </a>
                             <a href="/superadmin/tenants" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                                Gyms
                            </a>
                        </nav>
                        <div className="p-4 border-t border-gray-800">
                            <button onClick={performLogout} className="w-full flex items-center justify-center px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                                Logout
                            </button>
                        </div>
                    </div>
                </aside>
                <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-800">{children}</main>
                <LogoutModal />
            </div>
        );
    };

    // Helper Component for Logout Modal
    const LogoutModal = () => (
        showLogoutConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-96 text-gray-800 shadow-xl">
                    <h3 className="text-xl font-bold mb-4">Confirm Logout</h3>
                    <p className="mb-6">Are you sure you want to secure your session?</p>
                    <div className="flex justify-end space-x-4">
                        <button onClick={cancelLogout} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button onClick={performLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Logout</button>
                    </div>
                </div>
            </div>
        )
    );
    
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"><h1 className="text-2xl animate-pulse">Initializing GymRatz...</h1></div>;
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
                <Route 
                    path="/superadmin/*" 
                    element={
                        <Routes>
                            <Route path="login" element={<SuperAdminLoginPage setUser={setUser} />} />
                            <Route 
                                path="*" 
                                element={
                                    <ProtectedRoute role="superadmin">
                                        <SuperAdminLayout>
                                            <Routes>
                                                <Route path="dashboard" element={<SuperAdminDashboardPage />} />
                                                <Route path="tenants" element={<SuperAdminDashboardPage />} />
                                                <Route path="*" element={<Navigate to="/superadmin/dashboard" />} />
                                            </Routes>
                                        </SuperAdminLayout>
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    } 
                />

                {/* --- ADMIN ROUTES --- */}
                <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout><AdminDashboardPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/add-fighter" element={<ProtectedRoute role="admin"><AdminLayout><AddFighterPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/edit-fighter/:id" element={<ProtectedRoute role="admin"><AdminLayout><EditFighterPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/fighter/:id" element={<ProtectedRoute role="admin"><AdminLayout><ViewFighterDetailsPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/attendance" element={<ProtectedRoute role="admin"><AdminLayout><AdminAttendancePage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminLayout><AdminSettingsPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/subscriptions" element={<ProtectedRoute role="admin"><AdminLayout><AdminSubscriptionPage /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/ask-doubt" element={<ProtectedRoute role="admin"><AdminLayout><AskDoubtPage /></AdminLayout></ProtectedRoute>} />
                {/* <Route path="/admin/fighter-level" element={<ProtectedRoute role="admin"><AdminLayout><FighterLevelPage /></AdminLayout></ProtectedRoute>} /> */}
                
                {/* --- FIGHTER ROUTES --- */}
                
                {/* UPDATED: Replaced /fighter/level with /fighter/stats */}
                <Route path="/fighter/stats" element={<ProtectedRoute role="fighter"><FighterLayout><GymStatsPage /></FighterLayout></ProtectedRoute>} />
                
                <Route path="/fighter/attendance/face" element={<ProtectedRoute role="fighter"><FighterLayout><FighterFaceRecognitionPage /></FighterLayout></ProtectedRoute>} />
                <Route path="/fighter/ask-doubt" element={<ProtectedRoute role="fighter"><FighterLayout><AskDoubtPage /></FighterLayout></ProtectedRoute>} />
                <Route path="/fighter/complete-profile" element={<ProtectedRoute role="fighter"><CompleteProfilePage /></ProtectedRoute>} />
                <Route path="/fighter" element={<ProtectedRoute role="fighter"><FighterLayout><FighterHomePage user={user} /></FighterLayout></ProtectedRoute>} />
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