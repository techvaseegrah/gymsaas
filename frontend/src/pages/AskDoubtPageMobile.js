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
        const filteredMessages = getFilteredMessages();
        
        // Common Chat Tab
        if (activeTab === 'common') {
            return (
                <div className="flex flex-col h-full">
                    {/* Messages container */}
                    <div className={`flex-grow overflow-y-auto p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading messages...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-center p-4 rounded-lg bg-red-100 text-red-700">
                                    <p>Error: {error}</p>
                                    <button 
                                        onClick={() => window.location.reload()} 
                                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="flex justify-center items-center h-full">
                                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                    No messages yet. Start a conversation!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredMessages.map((message) => (
                                    <div 
                                        key={message._id} 
                                        className={`p-3 rounded-lg max-w-[85%] ${
                                            message.user?._id === currentUser?._id
                                                ? theme === 'dark'
                                                    ? 'bg-blue-600 text-white ml-auto'
                                                    : 'bg-blue-500 text-white ml-auto'
                                                : theme === 'dark'
                                                    ? 'bg-gray-800 text-white'
                                                    : 'bg-white text-gray-800'
                                        }`}
                                    >
                                        {message.user?._id !== currentUser?._id && (
                                            <p className={`text-sm font-semibold mb-1 ${
                                                theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                                            }`}>
                                                {message.user?.name}
                                            </p>
                                        )}
                                        <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                                        <p className={`text-xs mt-1 ${
                                            message.user?._id === currentUser?._id
                                                ? theme === 'dark' ? 'text-blue-200' : 'text-blue-100'
                                                : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Message input */}
                    <div className={`p-3 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && newMessage.trim()) {
                                        handleSendMessage({
                                            text: newMessage,
                                            messageType: getNextMessageType()
                                        });
                                        setNewMessage('');
                                    }
                                }}
                                placeholder="Type a message..."
                                className={`flex-grow p-2 rounded-l-lg border text-sm ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                                }`}
                            />
                            <button
                                onClick={() => {
                                    if (newMessage.trim()) {
                                        handleSendMessage({
                                            text: newMessage,
                                            messageType: getNextMessageType()
                                        });
                                        setNewMessage('');
                                    }
                                }}
                                disabled={!newMessage.trim()}
                                className={`px-4 py-2 rounded-r-lg font-medium text-sm transition-colors ${
                                    newMessage.trim()
                                        ? theme === 'dark'
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : theme === 'dark'
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        
        // Private Chats Tab
        if (activeTab === 'private') {
            // If we're viewing a specific chat
            if (activeChat?.type === 'private' && activeChat?.peer?._id) {
                return (
                    <div className="flex flex-col h-full">
                        {/* Chat header */}
                        <div className={`p-3 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center">
                                <button 
                                    onClick={() => setActiveChat({ type: 'common', peer: { _id: null, name: 'Private Chats' } })}
                                    className={`mr-2 p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                >
                                    <FaChevronLeft />
                                </button>
                                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                    {activeChat.peer.name}
                                </h3>
                            </div>
                        </div>
                        
                        {/* Messages container */}
                        <div className={`flex-grow overflow-y-auto p-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-center">
                                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading messages...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-center p-3 rounded-lg bg-red-100 text-red-700">
                                        <p>Error: {error}</p>
                                        <button 
                                            onClick={() => window.location.reload()} 
                                            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="flex justify-center items-center h-full">
                                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                        No messages yet. Send a message to start chatting!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredMessages.map((message) => (
                                        <div 
                                            key={message._id} 
                                            className={`p-3 rounded-lg max-w-[85%] ${
                                                message.user?._id === currentUser?._id
                                                    ? theme === 'dark'
                                                        ? 'bg-blue-600 text-white ml-auto'
                                                        : 'bg-blue-500 text-white ml-auto'
                                                    : theme === 'dark'
                                                        ? 'bg-gray-800 text-white'
                                                        : 'bg-white text-gray-800'
                                            }`}
                                        >
                                            {message.user?._id !== currentUser?._id && (
                                                <p className={`text-sm font-semibold mb-1 ${
                                                    theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                                                }`}>
                                                    {message.user?.name}
                                                </p>
                                            )}
                                            <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                                            <p className={`text-xs mt-1 ${
                                                message.user?._id === currentUser?._id
                                                    ? theme === 'dark' ? 'text-blue-200' : 'text-blue-100'
                                                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Message input */}
                        <div className={`p-3 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && newMessage.trim()) {
                                            handleSendMessage({
                                                text: newMessage,
                                                messageType: getNextMessageType()
                                            });
                                            setNewMessage('');
                                        }
                                    }}
                                    placeholder="Type a message..."
                                    className={`flex-grow p-2 rounded-l-lg border text-sm ${
                                        theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                                    }`}
                                />
                                <button
                                    onClick={() => {
                                        if (newMessage.trim()) {
                                            handleSendMessage({
                                                text: newMessage,
                                                messageType: getNextMessageType()
                                            });
                                            setNewMessage('');
                                        }
                                    }}
                                    disabled={!newMessage.trim()}
                                    className={`px-4 py-2 rounded-r-lg font-medium text-sm transition-colors ${
                                        newMessage.trim()
                                            ? theme === 'dark'
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                            : theme === 'dark'
                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                );
            } else {
                // Show list of private chats
                return (
                    <div className={`flex-grow overflow-y-auto p-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                        <h3 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            {currentUser?.role === 'admin' ? 'Fighters' : 'Admin'}
                        </h3>
                        
                        {currentUser?.role === 'admin' ? (
                            fighters.length === 0 ? (
                                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No fighters found</p>
                            ) : (
                                <div className="space-y-2">
                                    {fighters.map((fighter) => (
                                        <div 
                                            key={fighter._id}
                                            onClick={() => {
                                                setActiveChat({ 
                                                    type: 'private', 
                                                    peer: { _id: fighter._id, name: fighter.name } 
                                                });
                                            }}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                                theme === 'dark' 
                                                    ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                                                    : 'bg-white hover:bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                                }`}>
                                                    <span className="font-bold">
                                                        {fighter.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{fighter.name}</p>
                                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Fighter
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div 
                                onClick={() => {
                                    if (adminId) {
                                        setActiveChat({ 
                                            type: 'private', 
                                            peer: { _id: adminId, name: 'Admin' } 
                                        });
                                    }
                                }}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                    theme === 'dark' 
                                        ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                                        : 'bg-white hover:bg-gray-100 text-gray-800'
                                }`}
                            >
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                    }`}>
                                        <span className="font-bold">A</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Admin</p>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Gym Administrator
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
        }
        
        // Notifications Tab
        if (activeTab === 'notifications') {
            return (
                <div className={`flex-grow overflow-y-auto p-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
                        {notifications.length > 0 && (
                            <button 
                                onClick={() => setNotifications([])}
                                className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                    
                    {notifications.length === 0 ? (
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No notifications</p>
                    ) : (
                        <div className="space-y-2">
                            {notifications.map((notification, index) => (
                                <div 
                                    key={index}
                                    className={`p-3 rounded-lg ${
                                        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                                    }`}
                                >
                                    <p className="font-medium">{notification.sender?.name}</p>
                                    <p className="text-sm mt-1">{notification.message}</p>
                                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Just now
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        
        // Default fallback
        return (
            <div className={`flex-grow flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Select a tab to view content</p>
            </div>
        );
    };

    return (
        <div className={`flex flex-col h-screen max-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
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
                        <h3 className={`text-xl font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
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