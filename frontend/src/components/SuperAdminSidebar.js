import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaBuilding,
    FaUsers,
    FaChartLine,
    FaMoneyBillWave,
    FaCogs,
    FaSignOutAlt,
    FaAngleDown,
    FaAngleRight,
    FaUserShield,
    FaDatabase,
    FaBell,
    FaCreditCard,
    FaReceipt,
    FaUserFriends
} from 'react-icons/fa';

const SuperAdminSidebar = ({ handleLogout, closeSidebar }) => {
    const [openMenus, setOpenMenus] = useState({
        gyms: false,
        users: false,
        billing: false,
        settings: false
    });

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const linkClasses = "flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200";
    const activeLinkClasses = "bg-purple-600 text-white";
    const subMenuClasses = "ml-4 pl-4 border-l border-gray-700";
    const subLinkClasses = "flex items-center w-full px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200";
    const activeSubLinkClasses = "bg-purple-600/50 text-white";

    const handleLinkClick = () => {
        if (closeSidebar) closeSidebar();
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
            {/* Logo and Title */}
            <div className="p-6 mb-2 text-center border-b border-gray-800">
                <div className="flex items-center justify-center mb-3">
                    <FaUserShield className="text-purple-500 text-2xl mr-2" />
                    <h1 className="text-xl font-bold text-white tracking-wider">SUPER ADMIN</h1>
                </div>
                <p className="text-xs text-purple-400 tracking-widest uppercase">Control Panel</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow px-3 space-y-1 overflow-y-auto py-4 custom-scrollbar">
                <NavLink 
                    to="/superadmin/dashboard" 
                    className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} 
                    onClick={handleLinkClick}
                >
                    <FaTachometerAlt className="mr-3" /> Dashboard
                </NavLink>

                {/* Gyms Management */}
                <div>
                    <button
                        onClick={() => toggleMenu('gyms')}
                        className={`${linkClasses} justify-between group`}
                    >
                        <div className="flex items-center">
                            <FaBuilding className="mr-3" /> Gyms
                        </div>
                        {openMenus.gyms ? <FaAngleDown /> : <FaAngleRight />}
                    </button>
                    {openMenus.gyms && (
                        <div className={subMenuClasses}>
                            <NavLink 
                                to="/superadmin/tenants" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                All Gyms
                            </NavLink>
                            <NavLink 
                                to="/superadmin/tenants/create" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                Create Gym
                            </NavLink>
                            <NavLink 
                                to="/superadmin/tenants/inactive" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                Inactive Gyms
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Users Management */}
                <div>
                    <button
                        onClick={() => toggleMenu('users')}
                        className={`${linkClasses} justify-between group`}
                    >
                        <div className="flex items-center">
                            <FaUsers className="mr-3" /> Users
                        </div>
                        {openMenus.users ? <FaAngleDown /> : <FaAngleRight />}
                    </button>
                    {openMenus.users && (
                        <div className={subMenuClasses}>
                            <NavLink 
                                to="/superadmin/users/admins" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                Admins
                            </NavLink>
                            <NavLink 
                                to="/superadmin/users/fighters" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                Fighters
                            </NavLink>
                            <NavLink 
                                to="/superadmin/users/superadmins" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                Super Admins
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Billing & Revenue */}
                <div>
                    <button
                        onClick={() => toggleMenu('billing')}
                        className={`${linkClasses} justify-between group`}
                    >
                        <div className="flex items-center">
                            <FaMoneyBillWave className="mr-3" /> Billing
                        </div>
                        {openMenus.billing ? <FaAngleDown /> : <FaAngleRight />}
                    </button>
                    {openMenus.billing && (
                        <div className={subMenuClasses}>
                            <NavLink 
                                to="/superadmin/billing/subscriptions" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                Subscriptions
                            </NavLink>
                            <NavLink 
                                to="/superadmin/billing/payments" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                Payment History
                            </NavLink>
                            <NavLink 
                                to="/superadmin/billing/invoices" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                Invoices
                            </NavLink>
                            <NavLink 
                                to="/superadmin/billing/refunds" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                Refunds
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Analytics */}
                <NavLink 
                    to="/superadmin/analytics" 
                    className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} 
                    onClick={handleLinkClick}
                >
                    <FaChartLine className="mr-3" /> Analytics
                </NavLink>

                {/* System Settings */}
                <div>
                    <button
                        onClick={() => toggleMenu('settings')}
                        className={`${linkClasses} justify-between group`}
                    >
                        <div className="flex items-center">
                            <FaCogs className="mr-3" /> System
                        </div>
                        {openMenus.settings ? <FaAngleDown /> : <FaAngleRight />}
                    </button>
                    {openMenus.settings && (
                        <div className={subMenuClasses}>
                            <NavLink 
                                to="/superadmin/settings/general" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                General Settings
                            </NavLink>
                            <NavLink 
                                to="/superadmin/settings/notifications" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                Notifications
                            </NavLink>
                            <NavLink 
                                to="/superadmin/settings/database" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                Database
                            </NavLink>
                            <NavLink 
                                to="/superadmin/settings/logs" 
                                className={({ isActive }) => `${subLinkClasses} ${isActive ? activeSubLinkClasses : ''}`}
                                onClick={handleLinkClick}
                            >
                                System Logs
                            </NavLink>
                        </div>
                    )}
                </div>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/20">
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

export default SuperAdminSidebar;