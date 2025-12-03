import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaCalendarCheck, FaSignOutAlt, FaDumbbell, FaEnvelope } from 'react-icons/fa';
import api from '../api/api';

const FighterSidebar = ({ handleLogout, closeSidebar }) => {
    const [fighterName, setFighterName] = useState('FIGHTER');
    const linkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200";
    const activeLinkClasses = "bg-blue-600 text-white";

    useEffect(() => {
        const fetchFighterData = async () => {
            try {
                const res = await api.get('/fighters/me');
                if (res.data?.name) setFighterName(res.data.name);
            } catch (err) { console.error(err); }
        };
        fetchFighterData();
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 mb-4 text-center">
                {/* REPLACED LOGO IMAGE WITH TEXT AVATAR */}
                <div className="w-24 h-24 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-3xl font-bold text-white border-2 border-gray-600 shadow-lg">
                    GR
                </div>
                <h1 className="text-xl font-bold text-white tracking-wider">{fighterName}</h1>
            </div>
            <nav className="flex-grow px-4 space-y-2">
                <NavLink to="/fighter" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`} onClick={closeSidebar}>
                    <FaHome className="mr-3" /> Home
                </NavLink>
                <NavLink to="/fighter/attendance" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`} onClick={closeSidebar}>
                    <FaCalendarCheck className="mr-3" /> My Attendance
                </NavLink>
                <NavLink to="/fighter/stats" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`} onClick={closeSidebar}>
                    <FaDumbbell className="mr-3" /> Gym Stats
                </NavLink>
                <NavLink to="/fighter/ask-doubt" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`} onClick={closeSidebar}>
                    <FaEnvelope className="mr-3" /> Ask Doubt
                </NavLink>
            </nav>
            <div className="p-4">
                <button onClick={() => { handleLogout(); closeSidebar(); }} className="w-full flex items-center justify-center px-4 py-3 text-gray-300 bg-gray-700 hover:bg-red-700 hover:text-white rounded-lg transition-colors">
                    <FaSignOutAlt className="mr-3" /> Logout
                </button>
            </div>
        </div>
    );
};

export default FighterSidebar;