import React from 'react';
import { 
    FaBuilding, FaUsers, FaChartLine, FaMoneyBillWave, 
    FaCogs, FaUserShield, FaDatabase, FaBell, FaCreditCard, 
    FaReceipt, FaUserFriends, FaPlus, FaBan, FaCheckCircle 
} from 'react-icons/fa';

const SuperAdminPageTemplate = ({ title, subtitle, icon: Icon, children, onExport, exportLabel = 'Export Data' }) => {
    return (
        <div className="min-h-screen text-white font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="flex items-center mb-4 md:mb-0">
                    <div className="p-3 bg-purple-600 rounded-lg mr-4">
                        {Icon && <Icon size={24} />}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-wide">{title}</h1>
                        <p className="text-purple-400 text-sm">{subtitle}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center">
                        <FaPlus className="mr-2" /> Add New
                    </button>
                    {onExport && (
                        <button 
                            onClick={onExport}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            {exportLabel}
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                {children || (
                    <div className="text-center py-12">
                        <div className="inline-block p-4 bg-gray-700 rounded-full mb-4">
                            {Icon && <Icon size={32} className="text-purple-400" />}
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{title}</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            This page is under development. The {title.toLowerCase()} module will allow you to manage all aspects of your SaaS platform efficiently.
                        </p>
                        <div className="mt-6 inline-block bg-gray-700 px-4 py-2 rounded-lg text-sm">
                            <span className="text-purple-400">Super Admin</span> • <span className="text-gray-400">Control Panel</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminPageTemplate;