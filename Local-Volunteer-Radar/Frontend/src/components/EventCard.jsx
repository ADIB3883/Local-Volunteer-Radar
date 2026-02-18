import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapModal from './MapModal';

// ─── Custom Alert Popup ───────────────────────────────────────────────────────
const CustomAlert = ({ alert, onClose }) => {
    if (!alert) return null;

    const styles = {
        success: { color: '#16a34a', bg: '#f0fdf4', border: '#16a34a' },
        error:   { color: '#dc2626', bg: '#fef2f2', border: '#dc2626' },
        info:    { color: '#0067DD', bg: '#eff6ff', border: '#0067DD' },
    };
    const s = styles[alert.type] || styles.info;

    const Icon = () => {
        if (alert.type === 'success') return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><polyline points="9 12 11.5 14.5 15.5 9.5"/>
            </svg>
        );
        if (alert.type === 'error') return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
        );
        return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
        );
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
            <style>{`@keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.18)', padding: '1.75rem', maxWidth: '400px', width: '90%', border: `1.5px solid ${s.border}`, animation: 'popIn 0.18s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1.5rem' }}>
                    <div style={{ flexShrink: 0, background: s.bg, borderRadius: '50%', padding: '6px', display: 'flex' }}>
                        <Icon />
                    </div>
                    <div>
                        {alert.title && <p style={{ fontWeight: '700', fontSize: '1rem', color: '#111', margin: '0 0 0.3rem 0' }}>{alert.title}</p>}
                        <p style={{ fontSize: '0.9rem', color: '#374151', margin: 0, lineHeight: '1.5' }}>{alert.message}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '0.45rem 1.5rem', background: s.color, color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                        onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const EventCard = ({
                       eventId,
                       title,
                       organizerId,
                       description,
                       tags,
                       date,
                       time,
                       location,
                       requirements,
                       onRegister
                   }) => {
    const navigate = useNavigate();
    const [registrationStatus, setRegistrationStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mapOpen, setMapOpen] = useState(false);

    // ─── Custom alert state ───────────────────────────────────────────────────
    const [alertState, setAlertState] = useState(null);

    const showAlert = (message, type = 'info', title = '', onClose = null) => {
        setAlertState({ message, type, title, onClose });
    };

    const handleAlertClose = () => {
        const cb = alertState?.onClose;
        setAlertState(null);
        if (cb) cb();
    };
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        const checkRegistrationStatus = async () => {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!loggedInUser) return;

            try {
                const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
                if (response.ok) {
                    const eventData = await response.json();

                    console.log('Checking registration for event:', eventId);
                    console.log('User email:', loggedInUser.email);
                    console.log('Event registrations:', eventData.registrations);

                    const userRegistration = eventData.registrations?.find(
                        reg => reg.volunteerEmail === loggedInUser.email
                    );

                    console.log('Found registration:', userRegistration);

                    if (userRegistration) {
                        setRegistrationStatus(userRegistration.status);
                    } else {
                        setRegistrationStatus(null);
                    }
                }
            } catch (error) {
                console.error('Error checking registration status:', error);
            }
        };

        checkRegistrationStatus();
    }, [eventId]);

    const handleRegister = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        if (!loggedInUser) {
            showAlert("Please login to register for events", "error", "Authentication Required");
            return;
        }

        const userType = loggedInUser.role || loggedInUser.type;
        if (userType !== "volunteer") {
            showAlert("Only volunteers can register for events", "error", "Access Denied");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    volunteerId: loggedInUser.id || loggedInUser._id,
                    volunteerEmail: loggedInUser.email,
                    volunteerName: loggedInUser.name || loggedInUser.fullName
                })
            });

            const data = await response.json();

            if (data.success) {
                showAlert(
                    'Successfully registered for the event! Your registration is pending organizer approval.',
                    'success',
                    'Registration Successful'
                );
                setRegistrationStatus('pending');
                if (onRegister) {
                    onRegister();
                }
            } else {
                showAlert(
                    data.message || 'Failed to register for event',
                    'error',
                    'Registration Failed'
                );
            }

        } catch (error) {
            console.error('Error registering for event:', error);
            showAlert(
                'Error registering for event. Please try again.',
                'error',
                'Registration Error'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleMessageOrganizer = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        if (!loggedInUser) {
            showAlert("Please login to message organizers", "error", "Authentication Required");
            return;
        }

        const userType = loggedInUser.role || loggedInUser.type;
        if (userType !== "volunteer") {
            showAlert("Only volunteers can message organizers", "error", "Access Denied");
            return;
        }

        const actualOrganizerId = organizerId || 'org_123';
        const organizerName = 'Swapno Organization';

        const conversationId = `${loggedInUser.email}_${actualOrganizerId}_${eventId}`;
        const conversation = {
            conversationId,
            participants: [
                { userId: loggedInUser.email, userName: loggedInUser.fullName || loggedInUser.name, userRole: 'volunteer' },
                { userId: actualOrganizerId, userName: organizerName, userRole: 'organizer' }
            ],
            eventId,
            eventName: title,
            lastMessage: '',
            lastMessageTime: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:5000/api/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(conversation)
            });

            if (response.ok) {
                localStorage.setItem('openChatConversation', JSON.stringify(conversation));
                window.dispatchEvent(new CustomEvent('openChat', { detail: conversation }));
            } else {
                console.error('Failed to create conversation');
                showAlert('Failed to start conversation. Please try again.', 'error', 'Connection Failed');
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
            localStorage.setItem('openChatConversation', JSON.stringify(conversation));
            window.dispatchEvent(new CustomEvent('openChat', { detail: conversation }));
        }
    };

    const getButtonContent = () => {
        if (loading) return "Registering...";
        if (!registrationStatus) return "Register to Volunteer";

        switch(registrationStatus.toLowerCase()) {
            case 'pending':   return "⏳ Registration Pending";
            case 'approved':  return "✓ Registered";
            case 'rejected':  return "✗ Registration Rejected";
            default:          return "Register to Volunteer";
        }
    };

    const getButtonStyle = () => {
        if (loading) return { background: 'linear-gradient(to right, #9ca3af, #6b7280)', cursor: 'not-allowed' };
        if (!registrationStatus) return { background: 'linear-gradient(to right, #3b82f6, #10b981)', cursor: 'pointer' };

        switch(registrationStatus.toLowerCase()) {
            case 'pending':  return { background: 'linear-gradient(to right, #f59e0b, #f97316)', cursor: 'not-allowed' };
            case 'approved': return { background: 'linear-gradient(to right, #10b981, #059669)', cursor: 'not-allowed' };
            case 'rejected': return { background: 'linear-gradient(to right, #ef4444, #dc2626)', cursor: 'not-allowed' };
            default:         return { background: 'linear-gradient(to right, #3b82f6, #10b981)', cursor: 'pointer' };
        }
    };

    return (
        <>
            {/* Custom Alert Popup */}
            <CustomAlert alert={alertState} onClose={handleAlertClose} />

            <div
                style={{
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.3s',
                    position: 'relative'
                }}
                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
            >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>
                    {title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: '0 0 1rem 0' }}>
                    {description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                border: '1px solid',
                                color: tag.type === 'skill' ? '#0891b2' : '#4b5563',
                                background: tag.type === 'skill' ? '#cffafe' : '#f3f4f6',
                                borderColor: tag.type === 'skill' ? '#67e8f9' : '#d1d5db'
                            }}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                        <Calendar size={16} style={{ color: '#3b82f6' }} />
                        <span>{date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                        <Clock size={16} style={{ color: '#10b981' }} />
                        <span>{time}</span>
                    </div>
                    {/* Clickable location row */}
                    <div
                        onClick={() => setMapOpen(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '0.875rem',
                            color: '#374151',
                            cursor: 'pointer',
                            borderRadius: '0.375rem',
                            padding: '0.25rem 0.375rem',
                            marginLeft: '-0.375rem',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Click to view on map"
                    >
                        <MapPin size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                        <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: '#9ca3af' }}>
                            {location}
                        </span>
                    </div>
                </div>

                <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ fontWeight: '600' }}>Requirements:</span> {requirements}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={registrationStatus || loading ? null : handleRegister}
                        disabled={!!registrationStatus || loading}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            ...getButtonStyle(),
                            color: 'white',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s',
                            opacity: registrationStatus || loading ? 0.9 : 1
                        }}
                    >
                        {getButtonContent()}
                    </button>

                    <button
                        onClick={handleMessageOrganizer}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                            transition: 'all 0.3s',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '50px'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 12px -1px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3)';
                        }}
                        title="Message Organizer"
                    >
                        <MessageCircle size={20} />
                    </button>
                </div>
            </div>

            {/* Map Modal */}
            <MapModal
                isOpen={mapOpen}
                onClose={() => setMapOpen(false)}
                location={location}
            />
        </>
    );
};

export default EventCard;