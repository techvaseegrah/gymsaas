import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom'; // Added Link import
import { FaEye, FaEyeSlash, FaUser, FaLock, FaSearch, FaBuilding, FaArrowLeft, FaDumbbell, FaUserShield } from 'react-icons/fa';
import api from '../api/api';

const LoginPage = ({ setUser }) => {
    // --- STATE MANAGEMENT ---
    const [loginType, setLoginType] = useState(null); // 'admin' or 'fighter'
    const [selectedGym, setSelectedGym] = useState(null);
    const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
    const [fighters, setFighters] = useState([]);
    const [selectedFighter, setSelectedFighter] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdminPassword, setShowAdminPassword] = useState(false);
    const [showFighterPassword, setShowFighterPassword] = useState(false);
    const [tenantSlug, setTenantSlug] = useState('');
    const [tenantError, setTenantError] = useState('');
    const [fighterPassword, setFighterPassword] = useState('');
    
    const navigate = useNavigate();

    // Fetch fighters when a gym is selected
    useEffect(() => {
        if (selectedGym && loginType === 'fighter') {
            const fetchFighters = async () => {
                setLoading(true);
                try {
                    const res = await api.get(`/fighters/list?tenant=${selectedGym.slug}`);
                    setFighters(res.data);
                } catch (err) {
                    setError('Failed to fetch fighter list.');
                } finally {
                    setLoading(false);
                }
            };
            fetchFighters();
        }
    }, [selectedGym, loginType]);

    // --- HELPER FUNCTIONS ---
    const getInitials = (name) => {
        if (!name) return '';
        const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
        return initials.substring(0, 2); // Max 2 initials
    };

    // --- HANDLERS ---
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { 
                ...adminCredentials, 
                role: 'admin',
                tenantSlug: selectedGym?.slug
            });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid admin credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleFighterLogin = async (e) => {
        e.preventDefault();
        if (!selectedFighter) return;
        setError(null);
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', {
                email: selectedFighter.email,
                password: fighterPassword,
                role: 'fighter',
                tenantSlug: selectedGym?.slug
            });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            navigate(data.user.profile_completed ? '/fighter' : '/fighter/complete-profile');
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid password.');
        } finally {
            setLoading(false);
        }
    };

    const handleTenantSlugSubmit = async (e) => {
        e.preventDefault();
        if (!tenantSlug.trim()) {
            setTenantError('Please enter a company name');
            return;
        }
        setLoading(true);
        setTenantError('');
        try {
            const res = await api.get(`/tenants/${tenantSlug}`);
            setSelectedGym(res.data);
        } catch (err) {
            setTenantError('Gym not found. Please check the ID.');
        } finally {
            setLoading(false);
        }
    };

    const handleFighterSelect = (fighter) => {
        setSelectedFighter(fighter);
        setError(null);
        setFighterPassword('');
    };

    const resetGymSelection = () => {
        setSelectedGym(null);
        setLoginType(null);
        setError(null);
        setSelectedFighter(null);
        setSearchTerm('');
        setTenantSlug('');
        setTenantError('');
        setFighterPassword('');
    };

    const filteredFighters = fighters.filter(fighter =>
        fighter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fighter.rfid.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- RENDER ---
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gray-900 flex items-center justify-center selection:bg-pink-500 selection:text-white font-sans">
            
            {/* 1. LIQUID BACKGROUND ANIMATION */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>
            
            {/* Glass Texture Overlay */}
            <div className="absolute inset-0 z-0 bg-gray-900/60 backdrop-blur-sm"></div>

            {/* 2. MAIN GLASS CARD */}
            <div className="relative z-10 w-full max-w-4xl px-4 transition-all duration-500">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden flex flex-col min-h-[500px]">
                    
                    {/* --- HEADER SECTION --- */}
                    <div className="p-8 text-center border-b border-white/10 relative">
                        {/* DYNAMIC LOGO: Changes to Fighter Photo when selected */}
                        <div className="inline-block p-1 bg-gradient-to-br from-white/20 to-transparent rounded-full mb-4 backdrop-blur-md shadow-lg ring-1 ring-white/30">
                            <img
                                src={selectedFighter?.profilePhoto || "/logo.png"} 
                                alt="Logo"
                                className="w-20 h-20 rounded-full object-cover"
                                onError={(e) => { e.target.src = "/logo.png"; }}
                            />
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
                            {selectedFighter ? selectedFighter.name : (selectedGym ? selectedGym.name : 'Mutants Academy')}
                        </h1>
                        <p className="text-blue-200 text-sm font-medium tracking-wider uppercase mt-2">
                            {selectedFighter ? 'Enter Password' : (loginType ? `${loginType} Portal` : 'Welcome Warrior')}
                        </p>
                    </div>

                    {/* --- BODY CONTENT --- */}
                    <div className="p-8 flex-grow flex flex-col justify-center items-center w-full">
                        
                        {/* VIEW 1: ROLE SELECTION */}
                        {!loginType ? (
                            <div className="w-full max-w-md space-y-4 animate-fade-in">
                                <button 
                                    onClick={() => setLoginType('admin')} 
                                    className="group w-full relative overflow-hidden rounded-2xl p-[1px] transition-all hover:scale-[1.02]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative flex items-center p-6 bg-gray-900/90 rounded-2xl h-full">
                                        <div className="p-3 bg-red-500/20 rounded-full mr-4 text-red-400"><FaUserShield size={24} /></div>
                                        <div className="text-left">
                                            <h3 className="text-lg font-bold text-white">Admin Access</h3>
                                            <p className="text-xs text-gray-400">Manage gym, fighters & settings</p>
                                        </div>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => setLoginType('fighter')} 
                                    className="group w-full relative overflow-hidden rounded-2xl p-[1px] transition-all hover:scale-[1.02]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative flex items-center p-6 bg-gray-900/90 rounded-2xl h-full">
                                        <div className="p-3 bg-blue-500/20 rounded-full mr-4 text-blue-400"><FaDumbbell size={24} /></div>
                                        <div className="text-left">
                                            <h3 className="text-lg font-bold text-white">Fighter Access</h3>
                                            <p className="text-xs text-gray-400">View stats, attendance & profile</p>
                                        </div>
                                    </div>
                                </button>
                                
                                <div className="text-center mt-4">
                                    <button 
                                        onClick={() => navigate('/superadmin/login')} 
                                        className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                                    >
                                        Super Admin Login
                                    </button>
                                </div>
                            </div>

                        /* VIEW 2: GYM ID SELECTION */
                        ) : !selectedGym ? (
                            <div className="w-full max-w-md animate-fade-in">
                                <form onSubmit={handleTenantSlugSubmit} className="space-y-6">
                                    <div className="relative group">
                                        <FaBuilding className="absolute left-4 top-4 text-gray-400 group-focus-within:text-white transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Enter Gym ID (e.g. mutants)"
                                            className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-black/40 focus:border-white/30 transition-all"
                                            value={tenantSlug}
                                            onChange={(e) => setTenantSlug(e.target.value)}
                                        />
                                    </div>
                                    {tenantError && <div className="text-red-300 text-sm text-center bg-red-500/20 p-2 rounded-lg">{tenantError}</div>}
                                    
                                    <button type="submit" disabled={loading} className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-bold transition-all">
                                        {loading ? 'Searching...' : 'Continue'}
                                    </button>
                                    <div className="text-center">
                                        <button type="button" onClick={resetGymSelection} className="text-gray-400 hover:text-white text-sm">Back</button>
                                    </div>
                                </form>
                            </div>

                        /* VIEW 3: FIGHTER SEARCH (Grid) */
                        ) : loginType === 'fighter' && !selectedFighter ? (
                            <div className="w-full animate-fade-in">
                                <div className="relative mb-6 max-w-md mx-auto">
                                    <FaSearch className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-white transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search your name..."
                                        className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-black/40 focus:border-white/30 transition-all glass-card"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {loading ? (
                                    <div className="text-center text-white/50 py-10">Loading roster...</div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                        {filteredFighters.map(fighter => (
                                            <div 
                                                key={fighter._id} 
                                                onClick={() => handleFighterSelect(fighter)} 
                                                className="glass-card group rounded-2xl p-4 flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/20"
                                            >
                                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-red-400 mb-3 transition-all relative flex items-center justify-center" style={{ backgroundColor: fighter.profilePhoto ? 'transparent' : '#EF4444' }}>
                                                    {fighter.profilePhoto ? (
                                                        <img
                                                            src={fighter.profilePhoto}
                                                            alt={fighter.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = "/logo.png"; }}
                                                        />
                                                    ) : (
                                                        <span className="text-white text-xl font-bold">
                                                            {getInitials(fighter.name)}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-white font-semibold text-sm text-center truncate w-full">{fighter.name}</h4>
                                                <p className="text-xs text-gray-400 truncate w-full text-center">{fighter.rfid}</p>
                                            </div>
                                        ))}
                                        {filteredFighters.length === 0 && <p className="col-span-full text-center text-gray-500">No fighters found.</p>}
                                    </div>
                                )}
                                <div className="text-center mt-6">
                                    <button 
                                        onClick={resetGymSelection} 
                                        className="text-gray-400 hover:text-white text-sm transition-colors duration-300 flex items-center justify-center gap-1 mx-auto"
                                    >
                                        <FaArrowLeft size={14} /> Change Gym
                                    </button>
                                </div>
                            </div>

                        /* VIEW 4: PASSWORD LOGIN (Admin or Fighter) */
                        ) : (
                            <div className="w-full max-w-md animate-fade-in">
                                <form onSubmit={loginType === 'admin' ? handleAdminLogin : handleFighterLogin} className="space-y-5">
                                    
                                    {/* Admin Email Input */}
                                    {loginType === 'admin' && (
                                        <div className="relative group">
                                            <FaUser className="absolute left-4 top-4 text-gray-400 group-focus-within:text-white transition-colors" />
                                            <input 
                                                type="email" 
                                                value={adminCredentials.email} 
                                                onChange={(e) => setAdminCredentials({ ...adminCredentials, email: e.target.value })} 
                                                placeholder="admin@example.com" 
                                                className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-black/40 focus:border-white/30 transition-all"
                                                required 
                                            />
                                        </div>
                                    )}

                                    {/* Password Input (Shared) */}
                                    <div className="relative group">
                                        <FaLock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-white transition-colors" />
                                        <input 
                                            type={loginType === 'admin' ? (showAdminPassword ? "text" : "password") : (showFighterPassword ? "text" : "password")} 
                                            value={loginType === 'admin' ? adminCredentials.password : fighterPassword} 
                                            onChange={(e) => loginType === 'admin' ? setAdminCredentials({ ...adminCredentials, password: e.target.value }) : setFighterPassword(e.target.value)} 
                                            placeholder="Password" 
                                            className="w-full pl-12 pr-12 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-black/40 focus:border-white/30 transition-all"
                                            required 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => loginType === 'admin' ? setShowAdminPassword(!showAdminPassword) : setShowFighterPassword(!showFighterPassword)}
                                            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {loginType === 'admin' 
                                                ? (showAdminPassword ? <FaEyeSlash /> : <FaEye />)
                                                : (showFighterPassword ? <FaEyeSlash /> : <FaEye />)
                                            }
                                        </button>
                                    </div>

                                    {/* Forgot Password Link - ADDED HERE */}
                                    <div className="flex justify-end">
                                        <Link 
                                            to="/forgot-password"
                                            className="text-sm text-blue-300 hover:text-white transition-colors"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    {error && (
                                        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm text-center animate-pulse">
                                            {error}
                                        </div>
                                    )}

                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className={`w-full py-4 font-bold text-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] flex justify-center items-center ${
                                            loginType === 'admin' 
                                            ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700' 
                                            : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700'
                                        }`}
                                    >
                                        {loading ? 'Authenticating...' : 'Sign In'}
                                    </button>
                                </form>

                                <div className="text-center mt-6">
                                    <button 
                                        onClick={loginType === 'fighter' ? () => { setSelectedFighter(null); setFighterPassword(''); } : resetGymSelection} 
                                        className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
                                    >
                                        <FaArrowLeft /> {loginType === 'fighter' ? 'Back to Fighters' : 'Back to Gym'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;