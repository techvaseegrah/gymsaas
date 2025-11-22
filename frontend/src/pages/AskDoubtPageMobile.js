import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaUsers, FaUserShield, FaBell, FaSun, FaMoon } from 'react-icons/fa';

const AskDoubtPageMobile = (props) => {
    // Extract all props
    const {
        currentUser,
        adminId,
        fighters,
        messages,
        activeChat,
        setActiveChat,
        newMessage,
        setNewMessage,
        loading,
        error,
        unreadCounts,
        notifications,
        setNotifications,
        handleSendMessage,
        handleDeleteMessage,
        getFilteredMessages,
        getNextMessageType,
        notification,
        notificationsEnabled,
        setNotificationsEnabled
    } = props;

    // Theme state - initialize from localStorage or default to 'dark'
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark';
    });

    // Active tab state
    const [activeTab, setActiveTab] = useState('common');

    // Replying to message state
    const [replyingTo, setReplyingTo] = useState(null);

    // Effect to save theme preference to localStorage
    useEffect(() => {
        localStorage.setItem('theme', theme);
        // Apply theme to document root for any global styling
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    // Toggle theme function
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    // Show back button logic
    const showBackButton = () => {
        return activeTab === 'private' && activeChat?.type === 'private' && activeChat?.peer?._id;
    };

    // Handle back navigation
    const handleBack = () => {
        if (activeTab === 'private' && activeChat?.type === 'private') {
            // Go back to private chats list
            setActiveChat({ type: 'common', peer: { _id: null, name: 'Common Group' } });
        } else {
            // Go back to common chat
            setActiveTab('common');
            setActiveChat({ type: 'common', peer: { _id: null, name: 'Common Group' } });
        }
    };

    // Render active tab content
    const renderActiveTab = () => {
        // This is a simplified version - in the actual implementation, 
        // this would render different components based on the active tab
        return (
            <div className={`p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p>Active Tab: {activeTab}</p>
                <p>Active Chat: {activeChat?.peer?.name || 'None'}</p>
            </div>
        );
    };

    return (
        <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {/* Header */}
            <div className={`p-4 border-b shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {showBackButton() && (
                            <button 
                                onClick={handleBack}
                                className={`mr-3 p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                <FaChevronLeft />
                            </button>
                        )}
                        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            {activeTab === 'common' ? 'Common Chat' : 
                             activeTab === 'private' ? 'Private Chats' : 
                             'Notifications'}
                        </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-colors ${
                                theme === 'dark' 
                                    ? 'text-yellow-400 bg-gray-700 hover:bg-gray-600' 
                                    : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                            }`}
                            title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {theme === 'dark' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
                        </button>
                        {activeTab === 'notifications' && notifications.length > 0 && (
                            <button 
                                onClick={() => setNotifications([])}
                                className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main content area that changes based on the active tab */}
            <div className="flex-grow overflow-hidden">
                {renderActiveTab()}
            </div>

            {/* Bottom Tab Navigator */}
            <div className={`flex justify-around items-center border-t p-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <button 
                    onClick={() => {
                        setActiveTab('common');
                        setActiveChat({ type: 'common', peer: { _id: null, name: 'Common Group' } });
                    }} 
                    className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'common' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}
                >
                    <FaUsers size={20} />
                    <span className="text-xs mt-1">Common</span>
                </button>
                <button 
                    onClick={() => {
                        setActiveTab('private');
                        // Don't automatically select a chat, show the list first
                        // BUT ensure we reset the activeChat to show the list view
                        if (activeChat?.type === 'private' && activeChat?.peer?._id) {
                            // If we're currently in a private chat, reset to show the list
                            setActiveChat({ type: 'common', peer: { _id: null, name: 'Common Group' } });
                        }
                    }} 
                    className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'private' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}
                >
                    <FaUserShield size={20} />
                    <span className="text-xs mt-1">Private</span>
                </button>
                <button 
                    onClick={() => setActiveTab('notifications')} 
                    className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'notifications' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}
                >
                    <div className="relative">
                        <FaBell size={20} />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {notifications.length}
                            </span>
                        )}
                    </div>
                    <span className="text-xs mt-1">Notifications</span>
                </button>
            </div>
        </div>
    );
};

export default AskDoubtPageMobile;