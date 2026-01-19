import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatInterface from './ChatInterface';

const MessagesTab = ({ currentUser }) => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    // Support both 'role' and 'type' properties for backward compatibility
    const userType = currentUser.role || currentUser.type;
    const isVolunteer = userType === 'volunteer';

    const filterOptions = isVolunteer
        ? ['All', 'Registered Event Organizer', 'Unregistered Event Organizer']
        : ['All', 'Registered Volunteers', 'Unregistered Volunteers'];

    useEffect(() => {
        fetchConversations();

        // Check for pending conversation to open
        const pendingChat = localStorage.getItem('openChatConversation');
        if (pendingChat) {
            try {
                const conversation = JSON.parse(pendingChat);
                console.log('📨 Opening pending conversation:', conversation);

                // Create conversation on backend if it doesn't exist
                createConversation(conversation).then(() => {
                    setSelectedConversation(conversation);
                    fetchConversations(); // Refresh list
                });

                localStorage.removeItem('openChatConversation');
            } catch (error) {
                console.error('Error opening pending conversation:', error);
                localStorage.removeItem('openChatConversation');
            }
        }
    }, []);

    const createConversation = async (conversation) => {
        try {
            const response = await fetch('http://localhost:5000/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(conversation)
            });
            const data = await response.json();
            console.log('✅ Conversation created/verified:', data);
            return data;
        } catch (error) {
            console.error('❌ Error creating conversation:', error);
        }
    };

    const fetchConversations = async () => {
        try {
            console.log('📥 Fetching conversations for:', currentUser.email);
            const response = await fetch(`http://localhost:5000/api/conversations/${currentUser.email}`);
            const data = await response.json();
            console.log('📥 Fetched conversations:', data);
            setConversations(data);
            setLoading(false);
        } catch (error) {
            console.error('❌ Error fetching conversations:', error);
            setLoading(false);
        }
    };

    const getFilteredConversations = () => {
        if (filter === 'All') return conversations;

        if (isVolunteer) {
            const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');

            if (filter === 'Registered Event Organizer') {
                return conversations.filter(conv => {
                    if (!conv.eventId) return false;
                    return registrations.some(reg =>
                        reg.eventId === conv.eventId &&
                        reg.volunteerEmail === currentUser.email &&
                        reg.status === 'Approved'
                    );
                });
            } else {
                return conversations.filter(conv => {
                    if (!conv.eventId) return true;
                    return !registrations.some(reg =>
                        reg.eventId === conv.eventId &&
                        reg.volunteerEmail === currentUser.email &&
                        reg.status === 'Approved'
                    );
                });
            }
        } else {
            const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');

            if (filter === 'Registered Volunteers') {
                return conversations.filter(conv => {
                    const volunteer = conv.participants.find(p => p.userRole === 'volunteer');
                    if (!volunteer || !conv.eventId) return false;
                    return registrations.some(reg =>
                        reg.eventId === conv.eventId &&
                        reg.volunteerEmail === volunteer.userId &&
                        reg.status === 'Approved'
                    );
                });
            } else {
                return conversations.filter(conv => {
                    const volunteer = conv.participants.find(p => p.userRole === 'volunteer');
                    if (!volunteer) return false;
                    if (!conv.eventId) return true;
                    return !registrations.some(reg =>
                        reg.eventId === conv.eventId &&
                        reg.volunteerEmail === volunteer.userId &&
                        reg.status === 'Approved'
                    );
                });
            }
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const messageDate = new Date(date);
        const diffMs = now - messageDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return messageDate.toLocaleDateString();
    };

    const filteredConversations = getFilteredConversations();

    if (selectedConversation) {
        return (
            <ChatInterface
                conversation={selectedConversation}
                onBack={() => {
                    setSelectedConversation(null);
                    fetchConversations();
                }}
                currentUser={currentUser}
            />
        );
    }

    return (
        <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', minHeight: '600px' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', background: '#3b82f6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageCircle size={20} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Messages</h2>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                    {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
                {filterOptions.map((option) => (
                    <button
                        key={option}
                        onClick={() => setFilter(option)}
                        style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            background: 'transparent',
                            color: filter === option ? '#3b82f6' : '#6b7280',
                            fontWeight: filter === option ? '600' : '500',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            borderBottom: filter === option ? '2px solid #3b82f6' : '2px solid transparent',
                            marginBottom: '-0.5rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { if (filter !== option) e.currentTarget.style.color = '#3b82f6'; }}
                        onMouseOut={(e) => { if (filter !== option) e.currentTarget.style.color = '#6b7280'; }}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {/* Conversations List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <p>Loading conversations...</p>
                </div>
            ) : filteredConversations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filteredConversations.map((conv) => {
                        const otherParticipant = conv.participants.find(p => p.userId !== currentUser.email);

                        return (
                            <div
                                key={conv.conversationId}
                                onClick={() => setSelectedConversation(conv)}
                                style={{
                                    padding: '1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: '#fafafa'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.background = '#eff6ff';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.background = '#fafafa';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem', flexShrink: 0 }}>
                                        {otherParticipant?.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.25rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {otherParticipant?.userName}
                                            </h3>
                                            <span style={{ fontSize: '0.75rem', color: '#9ca3af', flexShrink: 0, marginLeft: '0.5rem' }}>
                                                {formatTime(conv.lastMessageTime)}
                                            </span>
                                        </div>
                                        {conv.eventName && (
                                            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#6b7280' }}>
                                                📍 {conv.eventName}
                                            </p>
                                        )}
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {conv.lastMessage || 'No messages yet'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <MessageCircle size={32} color="#9ca3af" />
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
                        No conversations yet
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                        {isVolunteer
                            ? 'Start a conversation by clicking the message icon on an event card'
                            : 'Volunteers will appear here when they message you'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MessagesTab;