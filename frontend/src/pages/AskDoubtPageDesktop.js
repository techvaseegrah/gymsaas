import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserShield, FaBell, FaSun, FaMoon, FaChevronLeft } from 'react-icons/fa';

const AskDoubtPageDesktop = (props) => {
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

    // Active section state
    const [activeSection, setActiveSection] = useState('chats');

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

    // Render chat list
    const renderChatList = () => {
        return (
            <div className="p-4 bg-[#1a1a1a] rounded-lg border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-white">Chat Rooms</h3>
                <div className="space-y-2">
                    <button
                        onClick={() => setActiveChat({ type: 'common', peer: { _id: null, name: 'Common Group' } })}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                            activeChat?.type === 'common'
                                ? 'bg-cyan-600 text-white'
                                : 'bg-[#222222] text-slate-300 hover:bg-white/10 border border-white/10'
                        }`}
                    >
                        <div className="flex items-center">
                            <FaUsers className="mr-2" />
                            <span>Common Group</span>
                            {unreadCounts.common > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {unreadCounts.common}
                                </span>
                            )}
                        </div>
                    </button>
                    
                    <div className="mt-4">
                        <h4 className="font-medium mb-2 text-slate-400">Private Chats</h4>
                        {currentUser?.role === 'admin' ? (
                            fighters.map(fighter => (
                                <button
                                    key={fighter._id}
                                    onClick={() => setActiveChat({ type: 'private', peer: fighter })}
                                    className={`w-full text-left p-3 rounded-lg transition-colors mb-1 ${
                                        activeChat?.type === 'private' && activeChat?.peer?._id === fighter._id
                                            ? 'bg-cyan-600 text-white'
                                            : 'bg-[#222222] text-slate-300 hover:bg-white/10 border border-white/10'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <FaUserShield className="mr-2" />
                                        <span>{fighter.name}</span>
                                        {unreadCounts[fighter._id] > 0 && (
                                            <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {unreadCounts[fighter._id]}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <button
                                onClick={() => setActiveChat({ type: 'private', peer: { _id: adminId, name: 'Admin' } })}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${
                                    activeChat?.type === 'private' && activeChat?.peer?._id === adminId
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-[#222222] text-slate-300 hover:bg-white/10 border border-white/10'
                                }`}
                            >
                                <div className="flex items-center">
                                    <FaUserShield className="mr-2" />
                                    <span>Admin</span>
                                    {unreadCounts[adminId] > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {unreadCounts[adminId]}
                                        </span>
                                    )}
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Render message area
    const renderMessageArea = () => {
        const filteredMessages = getFilteredMessages();
        
        return (
            <div className="flex flex-col h-full">
                {/* Chat header */}
                <div className="p-4 border-b border-white/10 bg-[#1a1a1a]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {activeChat?.type === 'private' && (
                                <button 
                                    onClick={() => setActiveChat({ type: 'common', peer: { _id: null, name: 'Common Group' } })}
                                    className="mr-3 p-2 rounded-lg hover:bg-white/10"
                                >
                                    <FaChevronLeft />
                                </button>
                            )}
                            <h3 className="text-xl font-bold text-white">
                                {activeChat?.peer?.name || 'Common Group'}
                            </h3>
                        </div>
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
                
                {/* Messages container */}
                <div className="flex-grow overflow-y-auto p-4 bg-[#0a0a0a]">
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
                                {activeChat?.type === 'common' 
                                    ? 'No messages yet. Start a conversation!' 
                                    : 'No messages yet. Send a message to start chatting!'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredMessages.map((message) => (
                                <div 
                                    key={message._id} 
                                    className={`p-4 rounded-lg max-w-3/4 ${
                                        message.user?._id === currentUser?._id
                                            ? 'bg-cyan-600 text-white ml-auto'
                                            : 'bg-[#1a1a1a] text-white border border-white/10'
                                    }`}
                                >
                                    {message.user?._id !== currentUser?._id && (
                                        <p className="text-sm font-semibold mb-1 text-cyan-400">
                                            {message.user?.name}
                                        </p>
                                    )}
                                    <p className="whitespace-pre-wrap">{message.text}</p>
                                    <p className={`text-xs mt-2 ${
                                        message.user?._id === currentUser?._id
                                            ? 'text-cyan-200' 
                                            : 'text-slate-400'
                                    }`}>
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {currentUser?.role === 'admin' && message.user?._id !== currentUser?._id && (
                                        <div className="mt-2 flex space-x-2">
                                            <button
                                                onClick={() => handleDeleteMessage(message._id)}
                                                className="text-xs px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Message input */}
                <div className="p-4 border-t border-white/10 bg-[#1a1a1a]">
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
                            placeholder={activeChat?.type === 'common' ? "Type a message to the group..." : "Type a message..."}
                            className="flex-grow p-3 rounded-l-lg border border-white/10 bg-[#222222] text-white placeholder-slate-400"
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
                            className={`px-6 py-3 rounded-r-lg font-medium transition-colors ${
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
    };

    // Render notifications
    const renderNotifications = () => {
        return (
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
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
                    <div className="text-center py-8">
                        <FaBell className="text-4xl mx-auto mb-2 text-slate-600" />
                        <p className="text-slate-400">No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif) => (
                            <div 
                                key={notif.id} 
                                className="p-4 rounded-lg border border-white/10 bg-[#1a1a1a]"
                            >
                                <div className="flex justify-between">
                                    <h4 className="font-bold text-white">
                                        {notif.senderName}
                                    </h4>
                                    <span className="text-xs text-slate-400">
                                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="mt-2 text-slate-300">
                                    {notif.text}
                                </p>
                                <div className="mt-3 flex space-x-2">
                                    <button
                                        onClick={() => {
                                            // Navigate to the chat where this message was sent
                                            if (notif.senderId) {
                                                const fighter = fighters.find(f => f._id === notif.senderId);
                                                if (fighter) {
                                                    setActiveChat({ type: 'private', peer: fighter });
                                                    setActiveSection('chats');
                                                }
                                            }
                                        }}
                                        className="text-sm px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white"
                                    >
                                        View Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-[#0a0a0a]">
            {/* Sidebar */}
            <div className="w-80 border-r bg-[#1a1a1a] border-white/10">
                {/* Header with theme toggle */}
                <div className="p-4 border-b bg-[#1a1a1a] border-white/10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">
                            Ask Doubt
                        </h2>
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
                
                {/* Navigation tabs */}
                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setActiveSection('chats')}
                        className={`flex-1 py-3 text-center font-medium ${
                            activeSection === 'chats'
                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-slate-400 hover:text-slate-300'
                        }`}
                    >
                        Chats
                    </button>
                    <button
                        onClick={() => setActiveSection('notifications')}
                        className={`flex-1 py-3 text-center font-medium relative ${
                            activeSection === 'notifications'
                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-slate-400 hover:text-slate-300'
                        }`}
                    >
                        Notifications
                        {notifications.length > 0 && (
                            <span className="absolute top-2 right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {notifications.length}
                            </span>
                        )}
                    </button>
                </div>
                
                {/* Content based on active section */}
                <div className="h-[calc(100vh-120px)] overflow-y-auto">
                    {activeSection === 'chats' ? renderChatList() : renderNotifications()}
                </div>
            </div>
            
            {/* Main chat area */}
            <div className="flex-grow">
                {renderMessageArea()}
            </div>
        </div>
    );
};

export default AskDoubtPageDesktop;