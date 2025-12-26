import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
    const [searchParams, setSearchParams] = useSearchParams();

    // --- INITIALIZATION & URL SYNC ---
    useEffect(() => {
        const roleParam = searchParams.get('role');
        const gymParam = searchParams.get('gym');

        if (roleParam && (roleParam === 'admin' || roleParam === 'fighter')) {
            setLoginType(roleParam);
        }

        if (gymParam && !selectedGym) {
            setTenantSlug(gymParam);
            fetchGymBySlug(gymParam);
        }
    }, [searchParams]);

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
    const fetchGymBySlug = async (slug) => {
        setLoading(true);
        try {
            const res = await api.get(`/tenants/${slug}`);
            setSelectedGym(res.data);
        } catch (err) {
            setTenantError('Gym not found from URL.');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '';
        const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
        return initials.substring(0, 2);
    };

    const updateUrl = (role, gym) => {
        const params = {};
        if (role) params.role = role;
        if (gym) params.gym = gym;
        setSearchParams(params);
    };

    // --- HANDLERS ---
    const handleRoleSelect = (role) => {
        setLoginType(role);
        updateUrl(role, selectedGym?.slug);
    };

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
            updateUrl(loginType, res.data.slug); 
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
        setSearchParams({});
    };

    const backToGymSelection = () => {
        setSelectedGym(null);
        setTenantSlug('');
        setTenantError('');
        updateUrl(loginType, null);
    };

    const backToFighterList = () => {
        setSelectedFighter(null);
        setFighterPassword('');
    };

    const filteredFighters = fighters.filter(fighter =>
        fighter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fighter.rfid.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- RENDER ---
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center selection:bg-accent selection:text-white font-sans">
            
            {/* Background elements for modern visual interest */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-accent/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            </div>

            {/* Main content container */}
            <div className="relative z-10 w-full max-w-2xl px-6 transition-all duration-500">
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-accent/10">
                    
                    {/* Header section */}
                    <div className="p-10 text-center border-b border-white/10 relative">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-blue-700 mb-6 font-bold text-white shadow-lg shadow-accent/30 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                            <span className="text-2xl">GR</span>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            {selectedFighter ? selectedFighter.name : (selectedGym ? selectedGym.name : 'GymRatz')}
                        </h1>
                        <p className="text-slate-400 text-sm font-medium tracking-wider uppercase">
                            {selectedFighter ? 'Enter Password' : (loginType ? `${loginType} Portal` : 'Welcome Warrior')}
                        </p>
                    </div>

                    {/* Body content */}
                    <div className="p-10 flex-grow flex flex-col justify-center items-center w-full">
                        
                        {/* VIEW 1: ROLE SELECTION */}
                        {!loginType ? (
                            <div className="w-full max-w-md space-y-5 animate-fade-in">
                                <button 
                                    onClick={() => handleRoleSelect('admin')} 
                                    className="w-full p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:from-white/10 hover:to-white/20 transition-all duration-300 flex items-center gap-5 group group-hover:shadow-lg group-hover:shadow-accent/10"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:text-white transition-colors relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <FaUserShield size={24} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-purple-400 transition-all duration-300">Admin Access</h3>
                                        <p className="text-sm text-slate-400 mt-1">Manage gym, fighters & settings</p>
                                    </div>
                                    <div className="text-slate-500 group-hover:text-accent transition-colors">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => handleRoleSelect('fighter')} 
                                    className="w-full p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:from-white/10 hover:to-white/20 transition-all duration-300 flex items-center gap-5 group group-hover:shadow-lg group-hover:shadow-accent/10"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:text-white transition-colors relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <FaDumbbell size={24} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-purple-400 transition-all duration-300">Fighter Access</h3>
                                        <p className="text-sm text-slate-400 mt-1">View stats, attendance & profile</p>
                                    </div>
                                    <div className="text-slate-500 group-hover:text-accent transition-colors">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </button>
                                
                                <div className="text-center mt-8 pt-8 border-t border-white/10">
                                    <button 
                                        onClick={() => navigate('/superadmin/login')} 
                                        className="text-slate-400 hover:text-accent text-sm transition-colors inline-flex items-center gap-2 group"
                                    >
                                        Super Admin Login 
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>

                        /* VIEW 2: GYM ID SELECTION */
                        ) : !selectedGym ? (
                            <div className="w-full max-w-md animate-fade-in">
                                <form onSubmit={handleTenantSlugSubmit} className="space-y-7">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Gym ID</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-accent">
                                                <FaBuilding />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Enter Gym ID (e.g. mutants)"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all group-focus-within:shadow-lg group-focus-within:shadow-accent/20"
                                                value={tenantSlug}
                                                onChange={(e) => setTenantSlug(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {tenantError && <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{tenantError}</div>}
                                    
                                    <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-accent to-blue-600 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed btn-shine relative overflow-hidden">
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Searching...</span>
                                            </div>
                                        ) : 'Continue'}
                                    </button>
                                    <div className="text-center">
                                        <button type="button" onClick={resetGymSelection} className="text-slate-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
                                        >
                                            <FaArrowLeft size={12} /> <span className="group-hover:-translate-x-0.5 transition-transform">Back to Role Selection</span>
                                        </button>
                                    </div>
                                </form>
                            </div>

                        /* VIEW 3: FIGHTER SEARCH (Grid) */
                        ) : loginType === 'fighter' && !selectedFighter ? (
                            <div className="w-full max-w-md animate-fade-in">
                                <div className="space-y-3 mb-7">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Search Fighter</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-accent">
                                            <FaSearch />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search your name..."
                                            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all group-focus-within:shadow-lg group-focus-within:shadow-accent/20"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="text-center text-slate-500 py-10">
                                        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                                        Loading roster...
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                        {filteredFighters.map(fighter => (
                                            <div 
                                                key={fighter._id} 
                                                onClick={() => handleFighterSelect(fighter)} 
                                                className="rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 p-5 flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 group"
                                            >
                                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-accent mb-4 transition-all relative flex items-center justify-center" style={{ backgroundColor: fighter.profilePhoto ? 'transparent' : '#3b82f6' }}>
                                                    {fighter.profilePhoto ? (
                                                        <img
                                                            src={fighter.profilePhoto}
                                                            alt={fighter.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = "/logo.png"; }} 
                                                        />
                                                    ) : (
                                                        <span className="text-white text-base font-bold">
                                                            {getInitials(fighter.name)}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-white font-semibold text-base text-center truncate w-full">{fighter.name}</h4>
                                                <p className="text-xs text-slate-500 truncate w-full text-center mt-1">{fighter.rfid}</p>
                                            </div>
                                        ))}
                                        {filteredFighters.length === 0 && <p className="col-span-full text-center text-slate-500 py-6">No fighters found.</p>}
                                    </div>
                                )}
                                <div className="text-center mt-8 pt-8 border-t border-white/10">
                                    <button 
                                        onClick={backToGymSelection} 
                                        className="text-slate-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
                                    >
                                        <FaArrowLeft size={12} /> <span className="group-hover:-translate-x-0.5 transition-transform">Change Gym</span>
                                    </button>
                                </div>
                            </div>

                        /* VIEW 4: PASSWORD LOGIN (Admin or Fighter) */
                        ) : (
                            <div className="w-full max-w-md animate-fade-in">
                                <form onSubmit={loginType === 'admin' ? handleAdminLogin : handleFighterLogin} className="space-y-6">
                                    
                                    {/* Admin Email Input */}
                                    {loginType === 'admin' && (
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-accent">
                                                    <FaUser />
                                                </div>
                                                <input 
                                                    type="email" 
                                                    value={adminCredentials.email} 
                                                    onChange={(e) => setAdminCredentials({ ...adminCredentials, email: e.target.value })} 
                                                    placeholder="admin@example.com" 
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all group-focus-within:shadow-lg group-focus-within:shadow-accent/20"
                                                    required 
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Password Input (Shared) */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-accent">
                                                <FaLock />
                                            </div>
                                            <input 
                                                type={loginType === 'admin' ? (showAdminPassword ? "text" : "password") : (showFighterPassword ? "text" : "password")} 
                                                value={loginType === 'admin' ? adminCredentials.password : fighterPassword} 
                                                onChange={(e) => loginType === 'admin' ? setAdminCredentials({ ...adminCredentials, password: e.target.value }) : setFighterPassword(e.target.value)} 
                                                placeholder="Enter your password" 
                                                className="w-full pl-12 pr-16 py-4 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all group-focus-within:shadow-lg group-focus-within:shadow-accent/20"
                                                required 
                                            />
                                            <button
                                                type="button"
                                                onClick={() => loginType === 'admin' ? setShowAdminPassword(!showAdminPassword) : setShowFighterPassword(!showFighterPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                            >
                                                {loginType === 'admin' 
                                                    ? (showAdminPassword ? <FaEyeSlash /> : <FaEye />)
                                                    : (showFighterPassword ? <FaEyeSlash /> : <FaEye />)
                                                }
                                            </button>
                                        </div>
                                    </div>

                                    {/* Forgot Password Link */}
                                    <div className="flex justify-end">
                                        <Link 
                                            to="/forgot-password"
                                            className="text-sm text-slate-400 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                                        >
                                            Forgot Password? <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                        </Link>
                                    </div>

                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                            {error}
                                        </div>
                                    )}

                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full py-4 bg-gradient-to-r from-accent to-blue-600 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed btn-shine relative overflow-hidden"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Authenticating...</span>
                                            </div>
                                        ) : 'Sign In'}
                                    </button>
                                </form>

                                <div className="text-center mt-8 pt-8 border-t border-white/10">
                                    <button 
                                        onClick={loginType === 'fighter' ? backToFighterList : backToGymSelection} 
                                        className="text-slate-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
                                    >
                                        <FaArrowLeft size={12} /> <span className="group-hover:-translate-x-0.5 transition-transform">{loginType === 'fighter' ? 'Back to Fighters' : 'Back to Gym'}</span>
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