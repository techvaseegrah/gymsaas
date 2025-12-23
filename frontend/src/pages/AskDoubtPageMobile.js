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
        // Always use dark theme for consistency with admin pages
        return 'dark';
    });

    // Active tab state
    const [activeTab, setActiveTab] = useState('common');

    // Effect to save theme preference to localStorage
    useEffect(() => {
        localStorage.setItem('theme', theme);
        // Always apply dark class for consistency
        document.documentElement.classList.add('dark');
    }, [theme]);

    // Toggle theme function
    const toggleTheme = () => {
        // Theme toggle is disabled to maintain consistency with admin pages
        // setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    // Show back button logic
    const showBackButton = () => {
        return activeTab === 'private' && activeChat?.type === 'private' && activeChat?.peer?._id;
    };

    // Handle back navigation
    const handleBack = () => {
        if (activeTab === 'private' && activeChat?.type === 'private') {
            setActiveChat({ type: 'common', peer: { _id: null, name: 'Common Group' } });
        } else {
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
                <div className="flex flex-col h-full w-full">
                    {/* Messages container */}
                    <div className={`flex-1 overflow-y-auto p-4 bg-[#0a0a0a]`}>
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-2"></div>
                                    <p className="text-slate-400">Loading messages...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-center p-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
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
                                <p className="text-slate-400">
                                    No messages yet. Start a conversation!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 pb-2">
                                {filteredMessages.map((message) => (
                                    <div 
                                        key={message._id} 
                                        className={`p-3 rounded-lg max-w-[85%] ${
                                            message.user?._id === currentUser?._id
                                                ? 'bg-cyan-600 text-white ml-auto'
                                                : 'bg-[#1a1a1a] text-white border border-white/10'
                                        }`}
                                    >
                                        {message.user?._id !== currentUser?._id && (
                                            <p className={`text-sm font-semibold mb-1 text-cyan-400`}>
                                                {message.user?.name}
                                            </p>
                                        )}
                                        <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                                        <p className={`text-xs mt-1 ${
                                            message.user?._id === currentUser?._id
                                                ? 'text-cyan-200' 
                                                : 'text-slate-400'
                                        }`}>
                                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Message input */}
                    <div className="p-3 border-t shrink-0 bg-[#1a1a1a] border-white/10">
                        <div className="flex gap-2">
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
                                className="flex-grow p-2 rounded-lg border border-white/10 bg-[#222222] text-white placeholder-slate-400 text-sm"
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
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                                    newMessage.trim()
                                        ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
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
                    <div className="flex flex-col h-full w-full">
                        {/* Chat header */}
                        <div className={`p-3 border-b shrink-0 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center">
                                <button 
                                    onClick={() => setActiveChat({ type: 'common', peer: { _id: null, name: 'Private Chats' } })}
                                    className="mr-2 p-2 rounded-lg hover:bg-white/10"
                                >
                                    <FaChevronLeft />
                                </button>
                                <h3 className="text-lg font-bold truncate text-white">
                                    {activeChat.peer.name}
                                </h3>
                            </div>
                        </div>
                        
                        {/* Messages container */}
                        <div className={`flex-1 overflow-y-auto p-3 bg-[#0a0a0a]`}>
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-center">
                                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cyan-500 mb-2"></div>
                                        <p className="text-slate-400">Loading messages...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-center p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                                        <p>Error: {error}</p>
                                    </div>
                                </div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="flex justify-center items-center h-full">
                                    <p className="text-slate-400">
                                        No messages yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3 pb-2">
                                    {filteredMessages.map((message) => (
                                        <div 
                                            key={message._id} 
                                            className={`p-3 rounded-lg max-w-[85%] ${
                                                message.user?._id === currentUser?._id
                                                    ? 'bg-cyan-600 text-white ml-auto'
                                                    : 'bg-[#1a1a1a] text-white border border-white/10'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                                            <p className={`text-xs mt-1 ${
                                                message.user?._id === currentUser?._id
                                                    ? 'text-cyan-200' 
                                                    : 'text-slate-400'
                                            }`}>
                                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Message input */}
                        <div className="p-3 border-t shrink-0 bg-[#1a1a1a] border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-grow p-2 rounded-lg border border-white/10 bg-[#222222] text-white placeholder-slate-400 text-sm"
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
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                        newMessage.trim()
                                            ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
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
                    // FIXED: Added h-full and w-full to ensure scroll works inside this container
                    <div className="flex-1 overflow-y-auto p-3 h-full w-full bg-[#0a0a0a]">
                        <h3 className="text-lg font-bold mb-3 text-white">
                            {currentUser?.role === 'admin' ? 'Fighters' : 'Admin'}
                        </h3>
                        
                        {currentUser?.role === 'admin' ? (
                            fighters.length === 0 ? (
                                <p className="text-slate-400">No fighters found</p>
                            ) : (
                                <div className="space-y-2 pb-16"> {/* Added padding bottom to prevent last item being hidden by bottom nav */}
                                    {fighters.map((fighter) => (
                                        <div 
                                            key={fighter._id}
                                            onClick={() => {
                                                setActiveChat({ 
                                                    type: 'private', 
                                                    peer: { _id: fighter._id, name: fighter.name } 
                                                });
                                            }}
                                            className="p-3 rounded-lg cursor-pointer transition-colors bg-[#1a1a1a] hover:bg-white/10 text-white border border-white/10"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-[#222222]">
                                                        <span className="font-bold">
                                                            {fighter.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{fighter.name}</p>
                                                        <p className="text-sm text-slate-400">
                                                            Fighter
                                                        </p>
                                                    </div>
                                                </div>
                                                {unreadCounts[fighter._id] > 0 && (
                                                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                        {unreadCounts[fighter._id]}
                                                    </span>
                                                )}
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
                                className="p-3 rounded-lg cursor-pointer transition-colors bg-[#1a1a1a] hover:bg-white/10 text-white border border-white/10"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-[#222222]">
                                            <span className="font-bold">A</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">Admin</p>
                                            <p className="text-sm text-slate-400">
                                                Gym Administrator
                                            </p>
                                        </div>
                                    </div>
                                    {unreadCounts[adminId] > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {unreadCounts[adminId]}
                                        </span>
                                    )}
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
                <div className="flex-1 overflow-y-auto p-3 h-full w-full bg-[#0a0a0a]">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold text-white">Notifications</h3>
                        {notifications.length > 0 && (
                            <button 
                                onClick={() => setNotifications([])}
                                className="text-sm text-cyan-400 hover:text-cyan-300"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                    
                    {notifications.length === 0 ? (
                        <p className="text-slate-400">No notifications</p>
                    ) : (
                        <div className="space-y-2">
                            {notifications.map((notification, index) => (
                                <div 
                                    key={index}
                                    className="p-3 rounded-lg border border-white/10 bg-[#1a1a1a]"
                                >
                                    <p className="font-medium text-white">{notification.senderName}</p>
                                    <p className="text-sm mt-1 text-slate-300">
                                        {notification.text}
                                    </p>
                                    <p className="text-xs mt-2 text-slate-400">
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
            <div className="flex-grow flex items-center justify-center p-4 bg-[#0a0a0a]">
                <p className="text-slate-400">Select a tab to view content</p>
            </div>
        );
    };

    return (
        // FIXED: Used h-[100dvh] for strict mobile viewport height without scrolling page
        <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-[#0a0a0a]">
            {/* Header - Fixed Height */}
            <div className="shrink-0 p-4 border-b bg-[#1a1a1a] border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {showBackButton() && (
                            <button 
                                onClick={handleBack}
                                className="mr-3 p-2 rounded-lg hover:bg-white/10"
                            >
                                <FaChevronLeft />
                            </button>
                        )}
                        <h3 className="text-xl font-bold truncate text-white">
                            {activeTab === 'common' ? 'Common Chat' : 
                             activeTab === 'private' ? (activeChat?.peer?.name || 'Private Chats') : 
                             'Notifications'}
                        </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full transition-colors text-slate-400 bg-[#222222] cursor-not-allowed opacity-50"
                            title="Theme toggle disabled for consistency"
                            disabled
                        >
                            <FaMoon className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content area - Flexible Height with Internal Scroll */}
            {/* FIXED: Added flex-1 and relative to consume exactly remaining space */}
            <div className="flex-1 relative w-full overflow-hidden flex flex-col">
                {renderActiveTab()}
            </div>

            {/* Bottom Tab Navigator - Fixed Height */}
            <div className="shrink-0 flex justify-around items-center border-t p-2 pb-safe bg-[#1a1a1a] border-white/10">
                <button 
                    onClick={() => {
                        setActiveTab('common');
                        setActiveChat({ type: 'common', peer: { _id: null, name: 'Common Group' } });
                    }} 
                    className={`flex flex-col items-center p-2 rounded-lg w-full ${activeTab === 'common' ? 'text-cyan-400 border-t-2 border-cyan-400' : 'text-slate-400 hover:text-slate-300'}`}
                >
                    <FaUsers size={20} />
                    <span className="text-xs mt-1">Common</span>
                </button>
                <button 
                    onClick={() => {
                        setActiveTab('private');
                        if (activeChat?.type === 'private' && activeChat?.peer?._id) {
                            setActiveChat({ type: 'common', peer: { _id: null, name: 'Common Group' } });
                        }
                    }} 
                    className={`flex flex-col items-center p-2 rounded-lg w-full ${activeTab === 'private' ? 'text-cyan-400 border-t-2 border-cyan-400' : 'text-slate-400 hover:text-slate-300'}`}
                >
                    <FaUserShield size={20} />
                    <span className="text-xs mt-1">Private</span>
                </button>
                <button 
                    onClick={() => setActiveTab('notifications')} 
                    className={`flex flex-col items-center p-2 rounded-lg w-full ${activeTab === 'notifications' ? 'text-cyan-400 border-t-2 border-cyan-400' : 'text-slate-400 hover:text-slate-300'}`}
                >
                    <div className="relative">
                        <FaBell size={20} />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {notifications.length}
                            </span>
                        )}
                    </div>
                    <span className="text-xs mt-1">Updates</span>
                </button>
            </div>
        </div>
    );
};

export default AskDoubtPageMobile;