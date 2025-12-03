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

    const linkClasses = "flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200";
    const activeLinkClasses = "bg-red-600 text-white";
    const subLinkClasses = "flex items-center w-full pl-11 pr-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200";
    const activeSubLinkClasses = "bg-red-600/50 text-white";

    const handleLinkClick = () => {
        if (closeSidebar) closeSidebar();
    };

    return (
        <div className="flex flex-col h-full bg-gray-800 border-r border-gray-700">
            {/* Logo and Title */}
            <div className="p-6 mb-2 text-center border-b border-gray-700">
                {/* REPLACED LOGO IMAGE WITH TEXT AVATAR */}
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white border-2 border-gray-500 shadow-md">
                    GR
                </div>
                <h1 className="text-lg font-bold text-white tracking-wider">ADMIN PANEL</h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow px-3 space-y-1 overflow-y-auto py-4 custom-scrollbar">
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} onClick={handleLinkClick}>
                    <FaTachometerAlt className="mr-3" /> Dashboard
                </NavLink>

                {/* Manage Fighters Dropdown */}
                <div>
                    <button
                        onClick={() => setIsManageFightersOpen(!isManageFightersOpen)}
                        className={`${linkClasses} justify-between group`}
                    >
                        <div className="flex items-center">
                            <FaUsers className="mr-3" /> Manage Fighters
                        </div>
                        {isManageFightersOpen ? <FaAngleUp /> : <FaAngleDown />}
                    </button>
                    {isManageFightersOpen && (
                        <div className="mt-1 space-y-1 mb-1 bg-gray-900/30 rounded-lg pb-2">
                            <NavLink
                                to="/admin/add-fighter"
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                <FaUserPlus className="mr-3 text-xs" /> Add Fighter
                            </NavLink>
                            <NavLink
                                to="/admin"
                                end
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                <FaListAlt className="mr-3 text-xs" /> View Fighters
                            </NavLink>
                        </div>
                    )}
                </div>

                <NavLink
                    to="/admin/attendance"
                    className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    onClick={handleLinkClick}
                >
                    <FaCalendarCheck className="mr-3" /> Attendance
                </NavLink>

                <NavLink
                    to="/admin/subscriptions"
                    className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    onClick={handleLinkClick}
                >
                    <FaMoneyBillWave className="mr-3" /> Subscriptions
                </NavLink>

                <NavLink
                    to="/admin/ask-doubt"
                    className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    onClick={handleLinkClick}
                >
                    <FaEnvelope className="mr-3" /> Ask Doubt
                </NavLink>

                <NavLink
                    to="/admin/fighter-level"
                    className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    onClick={handleLinkClick}
                >
                    <FaChartLine className="mr-3" /> Fighter Levels
                </NavLink>
                
                <NavLink
                    to="/admin/settings"
                    className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    onClick={handleLinkClick}
                >
                    <FaCog className="mr-3" /> Settings
                </NavLink>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700 bg-gray-900/20">
                <button 
                    onClick={() => { handleLogout(); handleLinkClick(); }} 
                    className="flex items-center justify-center w-full px-4 py-3 text-red-400 bg-red-900/10 hover:bg-red-600 hover:text-white border border-red-900/20 hover:border-transparent rounded-xl transition-all duration-200 group"
                >
                    <FaSignOutAlt className="mr-3 group-hover:rotate-180 transition-transform duration-300" /> 
                    <span className="font-semibold">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;