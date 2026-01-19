import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Circle } from 'lucide-react';
import io from 'socket.io-client';

// Initialize socket OUTSIDE component to avoid reconnections
let socket = null;

const getSocket = () => {
    if (!socket) {
        socket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error);
        });
    }
    return socket;
};

const ChatInterface = ({ conversation, onBack, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    const otherParticipant = conversation.participants.find(p => p.userId !== currentUser.email);

    useEffect(() => {
        console.log('🔌 ChatInterface mounted');
        console.log('Current user:', currentUser.email);
        console.log('Conversation:', conversation.conversationId);

        // Get socket instance
        socketRef.current = getSocket();

        // Join user's room
        console.log('📤 Joining room:', currentUser.email);
        socketRef.current.emit('join', currentUser.email);

        // Fetch messages
        fetchMessages();

        // Mark messages as read
        markAsRead();

        // Listen for new messages
        const handleReceiveMessage = (message) => {
            console.log('📨 Received message:', message);
            if (message.conversationId === conversation.conversationId) {
                setMessages(prev => {
                    // If this is a real message from server (not temp), remove any temp messages with same content
                    if (message._id && !message._id.toString().startsWith('temp-')) {
                        // Check if we already have this exact message by ID
                        const existsById = prev.some(m => m._id === message._id);
                        if (existsById) {
                            console.log('⚠️ Duplicate message by ID, ignoring');
                            return prev;
                        }

                        // Remove temp message with same content from same sender
                        const filteredMessages = prev.filter(m => {
                            const isTemp = m._id && m._id.toString().startsWith('temp-');
                            const isSameContent = m.message === message.message && m.senderId === message.senderId;

                            if (isTemp && isSameContent) {
                                console.log('🔄 Replacing temp message with real message');
                                return false; // Remove temp message
                            }
                            return true; // Keep other messages
                        });

                        return [...filteredMessages, message];
                    }

                    // For temp messages or other cases, just add if not duplicate
                    const exists = prev.some(m => m._id === message._id);
                    if (exists) {
                        console.log('⚠️ Duplicate message detected, ignoring');
                        return prev;
                    }


                    return [...prev, message];
                });
                markAsRead();
            }
        };

        socketRef.current.on('receive_message', handleReceiveMessage);

        // Listen for typing
        const handleTyping = (data) => {
            if (data.conversationId === conversation.conversationId) {
                setIsTyping(data.isTyping);
            }
        };

        socketRef.current.on('user_typing', handleTyping);

        return () => {
            console.log('🔌 ChatInterface unmounting');
            socketRef.current.off('receive_message', handleReceiveMessage);
            socketRef.current.off('user_typing', handleTyping);
        };
    }, [conversation.conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            console.log('📥 Fetching messages for:', conversation.conversationId);
            const response = await fetch(`http://localhost:5000/api/messages/${conversation.conversationId}`);
            const data = await response.json();
            console.log('📥 Fetched messages:', data.length);
            setMessages(data);
        } catch (error) {
            console.error('❌ Error fetching messages:', error);
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
            console.error('❌ Error marking as read:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleTyping = () => {
        if (!socketRef.current) return;

        const userName = currentUser.fullName || currentUser.name || 'User';

        socketRef.current.emit('typing', {
            conversationId: conversation.conversationId,
            receiverId: otherParticipant.userId,
            isTyping: true,
            userName: userName
        });

        if (typingTimeout) clearTimeout(typingTimeout);

        const timeout = setTimeout(() => {
            socketRef.current.emit('typing', {
                conversationId: conversation.conversationId,
                receiverId: otherParticipant.userId,
                isTyping: false,
                userName: userName
            });
        }, 1000);

        setTypingTimeout(timeout);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        if (!socketRef.current) {
            console.error('❌ Socket not connected');
            alert('Connection error. Please refresh the page.');
            return;
        }

        // Support both property naming conventions
        const userName = currentUser.fullName || currentUser.name || 'User';
        const userRole = currentUser.role || currentUser.type || 'volunteer';

        const messageData = {
            conversationId: conversation.conversationId,
            senderId: currentUser.email,
            senderName: userName,
            senderRole: userRole,
            receiverId: otherParticipant.userId,
            receiverName: otherParticipant.userName,
            receiverRole: otherParticipant.userRole,
            eventId: conversation.eventId,
            eventName: conversation.eventName,
            message: newMessage,
            createdAt: new Date().toISOString()
        };

        // Optimistic update - show message immediately
        const optimisticMessage = {
            ...messageData,
            _id: 'temp-' + Date.now(),
            read: false
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage('');

        console.log('📤 Sending message:', messageData);
        socketRef.current.emit('send_message', messageData);
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
                        <div key={msg._id || idx} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
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
                            <Circle size={8} className="pulse-dot" />
                            <Circle size={8} className="pulse-dot" style={{ animationDelay: '0.2s' }} />
                            <Circle size={8} className="pulse-dot" style={{ animationDelay: '0.4s' }} />
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
                .pulse-dot {
                    animation: pulse 1.4s infinite;
                }
            `}</style>
        </div>
    );
};

export default ChatInterface;
