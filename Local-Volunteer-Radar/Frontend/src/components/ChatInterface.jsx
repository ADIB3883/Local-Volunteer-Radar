import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Circle } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatInterface = ({ conversation, onBack, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const messagesEndRef = useRef(null);

    const otherParticipant = conversation.participants.find(p => p.userId !== currentUser.email);

    useEffect(() => {
        // Join user's room
        socket.emit('join', currentUser.email);

        // Fetch messages
        fetchMessages();

        // Mark messages as read
        markAsRead();

        // Listen for new messages
        socket.on('receive_message', (message) => {
            if (message.conversationId === conversation.conversationId) {
                setMessages(prev => [...prev, message]);
                markAsRead();
            }
        });

        // Listen for typing
        socket.on('user_typing', (data) => {
            if (data.conversationId === conversation.conversationId) {
                setIsTyping(data.isTyping);
            }
        });

        return () => {
            socket.off('receive_message');
            socket.off('user_typing');
        };
    }, [conversation.conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/messages/${conversation.conversationId}`);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const markAsRead = async () => {
        try {
            await fetch('http://localhost:5000/api/messages/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: conversation.conversationId,
                    userId: currentUser.email
                })
            });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleTyping = () => {
        socket.emit('typing', {
            conversationId: conversation.conversationId,
            receiverId: otherParticipant.userId,
            isTyping: true,
            userName: currentUser.fullName
        });

        if (typingTimeout) clearTimeout(typingTimeout);

        const timeout = setTimeout(() => {
            socket.emit('typing', {
                conversationId: conversation.conversationId,
                receiverId: otherParticipant.userId,
                isTyping: false,
                userName: currentUser.fullName
            });
        }, 1000);

        setTypingTimeout(timeout);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const messageData = {
            conversationId: conversation.conversationId,
            senderId: currentUser.email,
            senderName: currentUser.fullName,
            senderRole: currentUser.role,
            receiverId: otherParticipant.userId,
            receiverName: otherParticipant.userName,
            receiverRole: otherParticipant.userRole,
            eventId: conversation.eventId,
            eventName: conversation.eventName,
            message: newMessage
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '600px', background: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={onBack} style={{ padding: '0.5rem', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '0.5rem', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <ArrowLeft size={20} />
                </button>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {otherParticipant.userName.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>{otherParticipant.userName}</h3>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                        {conversation.eventName ? `Event: ${conversation.eventName}` : otherParticipant.userRole}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, idx) => {
                    const isOwn = msg.senderId === currentUser.email;
                    return (
                        <div key={idx} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                            <div style={{ maxWidth: '70%' }}>
                                <div style={{ background: isOwn ? '#3b82f6' : '#f3f4f6', color: isOwn ? 'white' : '#111827', padding: '0.75rem 1rem', borderRadius: '1rem', borderTopRightRadius: isOwn ? '0.25rem' : '1rem', borderTopLeftRadius: isOwn ? '1rem' : '0.25rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.9375rem', wordWrap: 'break-word' }}>{msg.message}</p>
                                </div>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#9ca3af', textAlign: isOwn ? 'right' : 'left' }}>
                                    {formatTime(msg.createdAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}
                {isTyping && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic' }}>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <Circle size={8} style={{ animation: 'pulse 1.4s infinite' }} />
                            <Circle size={8} style={{ animation: 'pulse 1.4s infinite 0.2s' }} />
                            <Circle size={8} style={{ animation: 'pulse 1.4s infinite 0.4s' }} />
                        </div>
                        <span>typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '0.9375rem', outline: 'none', transition: 'all 0.2s' }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#3b82f6';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        style={{ padding: '0.75rem 1.5rem', background: newMessage.trim() ? '#3b82f6' : '#e5e7eb', color: newMessage.trim() ? 'white' : '#9ca3af', border: 'none', borderRadius: '0.75rem', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { if (newMessage.trim()) e.currentTarget.style.background = '#2563eb'; }}
                        onMouseOut={(e) => { if (newMessage.trim()) e.currentTarget.style.background = '#3b82f6'; }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ChatInterface;