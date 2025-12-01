import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaBuilding,
    FaUsers,
    FaMoneyBillWave,
    FaCogs,
    FaSignOutAlt,
    FaUserShield
} from 'react-icons/fa';

const SuperAdminSidebar = ({ handleLogout, closeSidebar }) => {
    const linkClasses = "flex items-center w-full px-4 py-4 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl transition-all duration-200 mb-2 font-medium";
    const activeLinkClasses = "bg-purple-600 text-white shadow-lg shadow-purple-900/50";

    const handleLinkClick = () => {
        if (closeSidebar) closeSidebar();
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
            {/* Logo and Title */}
            <div className="p-8 mb-4 text-center border-b border-gray-800">
                <div className="flex items-center justify-center mb-3">
                    <FaUserShield className="text-purple-500 text-3xl mr-3" />
                    <h1 className="text-2xl font-bold text-white tracking-wider">SUPER ADMIN</h1>
                </div>
                <p className="text-xs text-purple-400 tracking-[0.2em] uppercase opacity-70">Control Panel</p>
            </div>

            {/* Navigation Links - Flat Structure */}
            <nav className="flex-grow px-4 space-y-2 overflow-y-auto py-4 custom-scrollbar">
                <NavLink 
                    to="/superadmin/dashboard" 
                    className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} 
                    onClick={handleLinkClick}
                >
                    <FaTachometerAlt className="mr-4 text-lg" /> Dashboard
                </NavLink>

                <NavLink 
                    to="/superadmin/gyms" 
                    className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} 
                    onClick={handleLinkClick}
                >
                    <FaBuilding className="mr-4 text-lg" /> Gyms
                </NavLink>

                <NavLink 
                    to="/superadmin/users" 
                    className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} 
                    onClick={handleLinkClick}
                >
                    <FaUsers className="mr-4 text-lg" /> Users
                </NavLink>

                <NavLink 
                    to="/superadmin/billing" 
                    className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} 
                    onClick={handleLinkClick}
                >
                    <FaMoneyBillWave className="mr-4 text-lg" /> Billing
                </NavLink>

                <NavLink 
                    to="/superadmin/settings" 
                    className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} 
                    onClick={handleLinkClick}
                >
                    <FaCogs className="mr-4 text-lg" /> Settings
                </NavLink>
            </nav>

            {/* Logout Button */}
            <div className="p-6 border-t border-gray-800 bg-gray-900/50">
                <button 
                    onClick={() => { handleLogout(); handleLinkClick(); }} 
                    className="flex items-center justify-center w-full px-4 py-4 text-red-400 bg-red-900/10 hover:bg-red-600 hover:text-white border border-red-900/20 hover:border-transparent rounded-xl transition-all duration-300 group"
                >
                    <FaSignOutAlt className="mr-3 text-lg group-hover:rotate-180 transition-transform duration-300" /> 
                    <span className="font-bold tracking-wide">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default SuperAdminSidebar;