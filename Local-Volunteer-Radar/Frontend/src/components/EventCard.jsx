import React, { useState } from 'react';
import { MapPin, Clock, Users, MessageCircle } from 'lucide-react';
import ChatInterface from './ChatInterface';

const EventCard = ({ eventId, title, description, tags, date, time, location, distance, requirements, onRegister }) => {
    const [showChat, setShowChat] = useState(false);
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // Get organizer info from the event
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const event = events.find(e => e.id === eventId);
    const organizerId = event?.organizerId || 'org_123';
    const organizerName = 'Swapno Organization'; // You can fetch this from a users collection

    const handleMessageClick = (e) => {
        e.stopPropagation();
        setShowChat(true);
    };

    const conversationId = `${loggedInUser.email}_${organizerId}_${eventId}`;
    const chatConversation = {
        conversationId,
        participants: [
            { userId: loggedInUser.email, userName: loggedInUser.fullName, userRole: 'volunteer' },
            { userId: organizerId, userName: organizerName, userRole: 'organizer' }
        ],
        eventId,
        eventName: title,
        lastMessage: '',
        lastMessageTime: new Date()
    };

    if (showChat) {
        return (
            <div style={{ gridColumn: '1 / -1' }}>
                <ChatInterface
                    conversation={chatConversation}
                    onBack={() => setShowChat(false)}
                    currentUser={loggedInUser}
                />
            </div>
        );
    }

    return (
        <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s',
            position: 'relative'
        }}
             onMouseOver={(e) => {
                 e.currentTarget.style.transform = 'translateY(-4px)';
                 e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
             }}
             onMouseOut={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
             }}>
            {/* Message Icon - Top Right */}
            <button
                onClick={handleMessageClick}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '36px',
                    height: '36px',
                    background: '#eff6ff',
                    border: '1px solid #3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    zIndex: 10
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = '#3b82f6';
                    e.currentTarget.querySelector('svg').setAttribute('stroke', 'white');
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = '#eff6ff';
                    e.currentTarget.querySelector('svg').setAttribute('stroke', '#3b82f6');
                }}
                title="Message organizer"
            >
                <MessageCircle size={18} color="#3b82f6" />
            </button>

            {/* Event Title */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem', paddingRight: '3rem' }}>{title}</h3>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {tags.map((tag, idx) => (
                    <span
                        key={idx}
                        style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            background: tag.type === 'skill' ? '#dbeafe' : '#fef3c7',
                            color: tag.type === 'skill' ? '#1e40af' : '#92400e'
                        }}
                    >
                        {tag.name}
                    </span>
                ))}
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem', lineHeight: '1.5' }}>{description}</p>

            {/* Event Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    <Clock size={16} style={{ color: '#10b981' }} />
                    <span>{date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    <Clock size={16} style={{ color: '#3b82f6' }} />
                    <span>{time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    <MapPin size={16} style={{ color: '#ef4444' }} />
                    <span>{location}</span>
                </div>
            </div>

            {/* Requirements */}
            {requirements && (
                <div style={{ background: '#f9fafb', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>Requirements:</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{requirements}</p>
                </div>
            )}

            {/* Register Button */}
            <button
                onClick={onRegister}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '0.875rem'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                Register Now
            </button>
        </div>
    );
};

export default EventCard;