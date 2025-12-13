import React, { useState, useEffect } from 'react';
import SuperAdminPageTemplate from '../components/SuperAdminPageTemplate';
import { FaEnvelope, FaTrash, FaReply, FaSearch } from 'react-icons/fa';
import { default as api } from '../api/api';

const SuperAdminContactMessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchContactMessages();
    }, []);

    const fetchContactMessages = async () => {
        console.log('Fetching contact messages...');
        try {
            const res = await api.get('/contact/superadmin/messages');
            console.log('Contact messages fetched successfully:', res.data);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to fetch contact messages:', err);
            // Let's also log the specific error details
            console.error('Error details:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data
            });
        } finally {
            console.log('Finished fetching contact messages');
            setLoading(false);
        }
    };

    const filteredMessages = messages.filter(message => 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper function to format Indian phone numbers
    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        
        // Remove all non-digit characters except +
        let cleaned = phone.replace(/[^\d+]/g, '');
        
        // If it starts with +91, format it nicely
        if (cleaned.startsWith('+91') && cleaned.length === 12) {
            return `+91 ${cleaned.substring(3, 8)} ${cleaned.substring(8)}`;
        }
        
        // If it's 10 digits, assume it's an Indian number without country code
        if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
            return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
        }
        
        // Return as is if no formatting applies
        return phone;
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/contact/superadmin/messages/${id}`, { status: 'read' });
            setMessages(messages.map(msg => 
                msg._id === id ? { ...msg, status: 'read' } : msg
            ));
        } catch (err) {
            console.error('Failed to mark message as read:', err);
        }
    };

    const deleteMessage = async (id) => {
        if(window.confirm('Are you sure you want to delete this message?')) {
            try {
                await api.delete(`/contact/superadmin/messages/${id}`);
                setMessages(messages.filter(msg => msg._id !== id));
                if (selectedMessage && selectedMessage._id === id) {
                    setSelectedMessage(null);
                }
            } catch (err) {
                console.error('Failed to delete message:', err);
            }
        }
    };

    return (
        <SuperAdminPageTemplate title="Contact Messages" Icon={FaEnvelope} showAddNew={false}>
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            )}
            {!loading && (
                <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3.5 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Search messages..." 
                            className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Messages List */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-gray-700 text-gray-400 uppercase text-xs">
                                    <tr>
                                        <th className="p-4">From</th>
                                        <th className="p-4">Company</th>
                                        <th className="p-4">Contact</th>
                                        <th className="p-4">Message</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredMessages.length > 0 ? filteredMessages.map(message => (
                                        <tr 
                                            key={message._id} 
                                            className={`hover:bg-gray-700/50 transition cursor-pointer ${message.status === 'unread' ? 'bg-gray-700/30' : ''}`}
                                            onClick={() => {
                                                setSelectedMessage(message);
                                                if (message.status === 'unread') {
                                                    markAsRead(message._id);
                                                }
                                            }}
                                        >
                                            <td className="p-4 font-bold text-white">
                                                {message.name}
                                                {message.status === 'unread' && (
                                                    <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                                                )}
                                            </td>
                                            <td className="p-4">{message.company}</td>
                                            <td className="p-4">
                                                <div>{message.email}</div>
                                                {message.phone && <div className="text-gray-400 text-sm">{formatPhoneNumber(message.phone)}</div>}
                                            </td>
                                            <td className="p-4 max-w-xs truncate">{message.message}</td>
                                            <td className="p-4 text-gray-400">{formatDate(message.createdAt)}</td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteMessage(message._id);
                                                    }}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-gray-500">
                                                {searchTerm ? 'No messages found matching your search.' : 'No contact messages yet.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Message Detail Modal */}
                    {selectedMessage && (
                        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                            <div 
                                className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-white">Message Details</h3>
                                    <button 
                                        onClick={() => setSelectedMessage(null)}
                                        className="text-gray-400 hover:text-white text-2xl"
                                    >
                                        &times;
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="text-gray-400 text-sm">From</label>
                                        <p className="text-white font-bold">{selectedMessage.name}</p>
                                        <p className="text-gray-400">{selectedMessage.email}</p>
                                        {selectedMessage.phone && <p className="text-gray-400">{formatPhoneNumber(selectedMessage.phone)}</p>}
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-sm">Company</label>
                                        <p className="text-white">{selectedMessage.company}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-sm">Date</label>
                                        <p className="text-white">{formatDate(selectedMessage.createdAt)}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-sm">Message</label>
                                        <p className="text-white bg-gray-900 p-4 rounded-lg mt-2">{selectedMessage.message}</p>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                                    <button 
                                        onClick={() => setSelectedMessage(null)}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                                    >
                                        Close
                                    </button>
                                    <button 
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition"
                                    >
                                        <FaReply /> Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </SuperAdminPageTemplate>
    );
};

export default SuperAdminContactMessagesPage;