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
        return savedTheme || 'dark';
    });

    // Active section state
    const [activeSection, setActiveSection] = useState('chats');

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

    // Render chat list
    const renderChatList = () => {
        return (
            <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Chat Rooms</h3>
                <div className="space-y-2">
                    <button
                        onClick={() => setActiveChat({ type: 'common', peer: { _id: null, name: 'Common Group' } })}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                            activeChat?.type === 'common'
                                ? theme === 'dark'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-500 text-white'
                                : theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                    : 'bg-white text-gray-800 hover:bg-gray-200'
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
                        <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Private Chats</h4>
                        {currentUser?.role === 'admin' ? (
                            fighters.map(fighter => (
                                <button
                                    key={fighter._id}
                                    onClick={() => setActiveChat({ type: 'private', peer: fighter })}
                                    className={`w-full text-left p-3 rounded-lg transition-colors mb-1 ${
                                        activeChat?.type === 'private' && activeChat?.peer?._id === fighter._id
                                            ? theme === 'dark'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-blue-500 text-white'
                                            : theme === 'dark'
                                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                                : 'bg-white text-gray-800 hover:bg-gray-200'
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
                                        ? theme === 'dark'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-blue-500 text-white'
                                        : theme === 'dark'
                                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                            : 'bg-white text-gray-800 hover:bg-gray-200'
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
                <div className={`p-4 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {activeChat?.type === 'private' && (
                                <button 
                                    onClick={() => setActiveChat({ type: 'common', peer: { _id: null, name: 'Common Group' } })}
                                    className={`mr-3 p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                >
                                    <FaChevronLeft />
                                </button>
                            )}
                            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                {activeChat?.peer?.name || 'Common Group'}
                            </h3>
                        </div>
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
                    </div>
                </div>
                
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
                                    <p className="whitespace-pre-wrap">{message.text}</p>
                                    <p className={`text-xs mt-2 ${
                                        message.user?._id === currentUser?._id
                                            ? theme === 'dark' ? 'text-blue-200' : 'text-blue-100'
                                            : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {currentUser?.role === 'admin' && message.user?._id !== currentUser?._id && (
                                        <div className="mt-2 flex space-x-2">
                                            <button
                                                onClick={() => handleDeleteMessage(message._id)}
                                                className={`text-xs px-2 py-1 rounded ${
                                                    theme === 'dark'
                                                        ? 'bg-red-700 hover:bg-red-600 text-white'
                                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                                }`}
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
                <div className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
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
                            className={`flex-grow p-3 rounded-l-lg border ${
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
                            className={`px-6 py-3 rounded-r-lg font-medium transition-colors ${
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
    };

    // Render notifications
    const renderNotifications = () => {
        return (
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
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
                    <div className="text-center py-8">
                        <FaBell className={`text-4xl mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif) => (
                            <div 
                                key={notif.id} 
                                className={`p-4 rounded-lg border ${
                                    theme === 'dark' 
                                        ? 'bg-gray-800 border-gray-700' 
                                        : 'bg-white border-gray-200'
                                }`}
                            >
                                <div className="flex justify-between">
                                    <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                        {notif.senderName}
                                    </h4>
                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
                                        className={`text-sm px-3 py-1 rounded ${
                                            theme === 'dark'
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }`}
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
        <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {/* Sidebar */}
            <div className={`w-80 border-r ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {/* Header with theme toggle */}
                <div className={`p-4 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            Ask Doubt
                        </h2>
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
                    </div>
                </div>
                
                {/* Navigation tabs */}
                <div className={`flex border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                        onClick={() => setActiveSection('chats')}
                        className={`flex-1 py-3 text-center font-medium ${
                            activeSection === 'chats'
                                ? theme === 'dark'
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-blue-600 border-b-2 border-blue-600'
                                : theme === 'dark'
                                    ? 'text-gray-400 hover:text-gray-300'
                                    : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Chats
                    </button>
                    <button
                        onClick={() => setActiveSection('notifications')}
                        className={`flex-1 py-3 text-center font-medium relative ${
                            activeSection === 'notifications'
                                ? theme === 'dark'
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-blue-600 border-b-2 border-blue-600'
                                : theme === 'dark'
                                    ? 'text-gray-400 hover:text-gray-300'
                                    : 'text-gray-500 hover:text-gray-700'
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