import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, MessageCircle } from 'lucide-react';
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

// ─── Single Registration Card (matches EventCard style exactly) ───────────────
const RegistrationCard = ({ reg, onMessageOrganizer }) => {
    const event = reg.event;
    const [mapOpen, setMapOpen] = useState(false);

    if (!event) return null;

    const status = reg.registrationStatus?.toLowerCase();

    const statusConfig = {
        pending:  { color: '#d97706', bg: '#fffbeb', icon: AlertCircle, label: '⏳ Registration Pending' },
        approved: { color: '#10b981', bg: '#d1fae5', icon: CheckCircle, label: '✓ Registered' },
        rejected: { color: '#ef4444', bg: '#fef2f2', icon: XCircle,    label: '✗ Registration Rejected' },
    };
    const sc = statusConfig[status] || statusConfig.pending;

    const registrationButtonStyle = {
        pending:  { background: 'linear-gradient(to right, #f59e0b, #f97316)', cursor: 'not-allowed' },
        approved: { background: 'linear-gradient(to right, #10b981, #059669)', cursor: 'not-allowed' },
        rejected: { background: 'linear-gradient(to right, #ef4444, #dc2626)', cursor: 'not-allowed' },
    };
    const btnStyle = registrationButtonStyle[status] || registrationButtonStyle.pending;

    // Tags: category chip + event status chip
    const tags = [
        event.category  ? { name: event.category, type: 'skill' } : null,
        event.status    ? { name: event.status,   type: 'status' } : null,
    ].filter(Boolean);

    const formatDate = (d) => new Date(d).toLocaleDateString('en-GB');
    const formatTime = (t) => new Date(`1970-01-01T${t}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return (
        <>
            <div
                style={{
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.3s',
                    position: 'relative',
                }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
            >
                {/* Title */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0' }}>
                    {event.eventName}
                </h3>

                {/* Organizer */}
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                    Organized by: {event.organizerId?.name || 'Unknown'}
                </p>

                {/* Description */}
                {event.description && (
                    <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                        {event.description.length > 120
                            ? event.description.substring(0, 120) + '...'
                            : event.description}
                    </p>
                )}

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {tags.map((tag, i) => (
                        <span key={i} style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            border: '1px solid',
                            color: tag.type === 'skill' ? '#0891b2' : '#4b5563',
                            background: tag.type === 'skill' ? '#cffafe' : '#f3f4f6',
                            borderColor: tag.type === 'skill' ? '#67e8f9' : '#d1d5db',
                        }}>
                            {tag.name}
                        </span>
                    ))}
                </div>

                {/* Date / Time / Location */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                        <Calendar size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
                        <span>{`${formatDate(event.startdate)} - ${formatDate(event.enddate)}`}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                        <Clock size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                        <span>{`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}</span>
                    </div>
                    {/* Clickable location — same as EventCard */}
                    <div
                        onClick={() => setMapOpen(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            fontSize: '0.875rem', color: '#374151',
                            cursor: 'pointer', borderRadius: '0.375rem',
                            padding: '0.25rem 0.375rem', marginLeft: '-0.375rem',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Click to view on map"
                    >
                        <MapPin size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                        <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: '#9ca3af' }}>
                            {event.location}
                        </span>
                    </div>
                </div>

                {/* Requirements */}
                <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ fontWeight: '600' }}>Requirements:</span>{' '}
                    {event.requirements || 'No specific requirements'}
                </div>

                {/* Registration date */}
                {reg.registeredAt && (
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 1rem 0' }}>
                        Registered on {new Date(reg.registeredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}

                {/* Buttons row — mirrors EventCard exactly */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Status button (non-interactive, shows registration state) */}
                    <button
                        disabled
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            ...btnStyle,
                            color: 'white',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            opacity: 0.92,
                        }}
                    >
                        {sc.label}
                    </button>

                    {/* Message organizer button — identical to EventCard */}
                    <button
                        onClick={() => onMessageOrganizer(reg)}
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
                            minWidth: '50px',
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 12px -1px rgba(59, 130, 246, 0.4)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3)'; }}
                        title="Message Organizer"
                    >
                        <MessageCircle size={20} />
                    </button>
                </div>
            </div>

            <MapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} location={event.location || ''} />
        </>
    );
};

// ─── Main MyRegistrations ─────────────────────────────────────────────────────
const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [alertState, setAlertState] = useState(null);

    const showAlert = (message, type = 'info', title = '', onClose = null) => setAlertState({ message, type, title, onClose });
    const handleAlertClose = () => {
        const cb = alertState?.onClose;
        setAlertState(null);
        if (cb) cb();
    };

    const loadRegistrations = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) { setLoading(false); return; }
        try {
            setLoading(true);
            const response = await fetch(`https://local-volunteer-radar.onrender.com/api/events/volunteer/${loggedInUser.email}/registrations`);
            if (!response.ok) throw new Error('Failed to fetch registrations');
            const data = await response.json();
            //if (data.success) setRegistrations(data.registrations);
            if (data.success) setRegistrations(
                data.registrations.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
            );
            else console.error('Failed to load registrations:', data.message);
        } catch (error) {
            console.error('Error loading registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadRegistrations(); }, []);

    // ─── Message organizer handler (same logic as EventCard) ──────────────────
    const handleMessageOrganizer = async (reg) => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            showAlert('Please login to message organizers', 'error', 'Authentication Required');
            return;
        }

        const event = reg.event;
        const actualOrganizerId = event?.organizerId?._id || event?.organizerId || 'org_123';
        const organizerName = event?.organizerId?.name || 'Organizer';
        const eventId = event?._id;
        const eventTitle = event?.eventName || 'Event';

        const conversationId = `${loggedInUser.email}_${actualOrganizerId}_${eventId}`;
        const conversation = {
            conversationId,
            participants: [
                { userId: loggedInUser.email, userName: loggedInUser.fullName || loggedInUser.name, userRole: 'volunteer' },
                { userId: actualOrganizerId,   userName: organizerName,                              userRole: 'organizer' },
            ],
            eventId,
            eventName: eventTitle,
            lastMessage: '',
            lastMessageTime: new Date().toISOString(),
        };

        try {
            const response = await fetch('https://local-volunteer-radar.onrender.com/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(conversation),
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
            // Fallback: still open the chat
            localStorage.setItem('openChatConversation', JSON.stringify(conversation));
            window.dispatchEvent(new CustomEvent('openChat', { detail: conversation }));
        }
    };

    const getCountByStatus = (s) => {
        if (s === 'All') return registrations.length;
        return registrations.filter(r => r.registrationStatus?.toLowerCase() === s.toLowerCase()).length;
    };

    const filteredRegistrations = filter === 'All'
        ? registrations
        : registrations.filter(r => r.registrationStatus?.toLowerCase() === filter.toLowerCase());

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <p style={{ fontSize: '1rem' }}>Loading your registrations...</p>
            </div>
        );
    }

    // ── Empty state ───────────────────────────────────────────────────────────
    if (registrations.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>No registrations yet</p>
                <p style={{ fontSize: '0.875rem' }}>Browse available events and register to start making a difference in your community!</p>
            </div>
        );
    }

    return (
        <>
            <CustomAlert alert={alertState} onClose={handleAlertClose} />

            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid',
                            borderColor: filter === f ? '#3b82f6' : '#e5e7eb',
                            background: filter === f ? '#eff6ff' : 'white',
                            color: filter === f ? '#3b82f6' : '#6b7280',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={e => { if (filter !== f) e.currentTarget.style.background = '#f9fafb'; }}
                        onMouseOut={e => { if (filter !== f) e.currentTarget.style.background = 'white'; }}
                    >
                        {f} ({getCountByStatus(f)})
                    </button>
                ))}
            </div>

            {/* Cards grid — same column sizing as event grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredRegistrations.map((reg, i) => (
                    <RegistrationCard
                        key={reg.event?._id || i}
                        reg={reg}
                        onMessageOrganizer={handleMessageOrganizer}
                    />
                ))}

                {filteredRegistrations.length === 0 && filter !== 'All' && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        <p>No {filter.toLowerCase()} registrations</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default MyRegistrations;