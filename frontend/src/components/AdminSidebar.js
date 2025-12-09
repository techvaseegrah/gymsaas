import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaUsers,
    FaUserPlus,
    FaListAlt,
    FaCalendarCheck,
    FaCog,
    FaSignOutAlt,
    FaAngleDown,
    FaAngleUp,
    FaChartLine,
    FaEnvelope,
    FaMoneyBillWave
} from 'react-icons/fa';

const AdminSidebar = ({ handleLogout, closeSidebar }) => {
    const [isManageFightersOpen, setIsManageFightersOpen] = useState(false);

    // Updated styles for Liquid Glass theme
    const linkClasses = "flex items-center w-full px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-cyan-400 rounded-xl transition-all duration-300 group";
    
    // Active state with Glow
    const activeLinkClasses = "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] border border-cyan-500/20";
    
    const subLinkClasses = "flex items-center w-full pl-11 pr-4 py-2 text-sm text-slate-500 hover:text-cyan-300 transition-colors duration-200";
    const activeSubLinkClasses = "text-cyan-400 font-medium";

    const handleLinkClick = () => {
        if (closeSidebar) closeSidebar();
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a]/90 backdrop-blur-xl border-r border-white/5">
            {/* Logo and Title */}
            <div className="p-6 mb-2 text-center relative">
                {/* Glow effect behind logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl"></div>
                
                <div className="relative w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-cyan-500/20 border border-white/10">
                    GR
                </div>
                <h1 className="relative text-sm font-bold text-white tracking-[0.2em] uppercase">Combat OS</h1>
                <p className="text-[10px] text-cyan-500/80 font-mono mt-1">ADMIN CONSOLE</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow px-4 space-y-2 overflow-y-auto py-4 custom-scrollbar">
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} onClick={handleLinkClick}>
                    <FaTachometerAlt className="mr-3 text-lg" /> Dashboard
                </NavLink>

                {/* Manage Fighters Dropdown */}
                <div>
                    <button
                        onClick={() => setIsManageFightersOpen(!isManageFightersOpen)}
                        className={`${linkClasses} justify-between w-full`}
                    >
                        <div className="flex items-center">
                            <FaUsers className="mr-3 text-lg" /> Fighters
                        </div>
                        {isManageFightersOpen ? <FaAngleUp className="text-xs" /> : <FaAngleDown className="text-xs" />}
                    </button>
                    {isManageFightersOpen && (
                        <div className="mt-1 ml-4 border-l-2 border-white/5 space-y-1 py-2">
                            <NavLink
                                to="/admin/add-fighter"
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                <span className="w-1 h-1 rounded-full bg-slate-600 mr-2"></span> Add New
                            </NavLink>
                            <NavLink
                                to="/admin"
                                end
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                <span className="w-1 h-1 rounded-full bg-slate-600 mr-2"></span> View Roster
                            </NavLink>
                        </div>
                    )}
                </div>

                <NavLink
                    to="/admin/attendance"
                    className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    onClick={handleLinkClick}
                >
                    <FaCalendarCheck className="mr-3 text-lg" /> Attendance
                </NavLink>

                <NavLink
                    to="/admin/subscriptions"
                    className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    onClick={handleLinkClick}
                >
                    <FaMoneyBillWave className="mr-3 text-lg" /> Subscriptions
                </NavLink>

                <NavLink
                    to="/admin/ask-doubt"
                    className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    onClick={handleLinkClick}
                >
                    <FaEnvelope className="mr-3 text-lg" /> Ask Doubt
                </NavLink>
                
                <NavLink
                    to="/admin/settings"
                    className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    onClick={handleLinkClick}
                >
                    <FaCog className="mr-3 text-lg" /> Settings
                </NavLink>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-white/5">
                <button 
                    onClick={() => { handleLogout(); handleLinkClick(); }} 
                    className="flex items-center justify-center w-full px-4 py-3 text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl transition-all duration-200 group"
                >
                    <FaSignOutAlt className="mr-3 group-hover:rotate-180 transition-transform duration-300" /> 
                    <span className="font-semibold text-sm">Disconnect</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;