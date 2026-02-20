import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, TrendingUp, Megaphone, LogOut, Plus, X, MessageCircle, Clock } from 'lucide-react';
import logo from "../assets/logo.png";
import Modal from './Modal';
import ActiveEventsOrganizerModal from './ActiveEventsOrganizerModal';
import TotalVolunteersOrganizerModal from './TotalVolunteersOrganizerModal';
import EventsCreatedModal from './EventsCreatedModal';
import MessagesTab from './MessageTab';
import axios from "axios";
import io from 'socket.io-client';

const API_URL = 'http://localhost:5000/api/events';
const socket = io('http://localhost:5000');

// ─── Helpers: same localStorage key MessagesTab uses ─────────────────────────
const STORAGE_KEY = 'msgLastSeen';

const getLastSeenMap = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
};

const isConversationUnread = (conv) => {
    if (!conv.lastMessageTime) return false;
    const map = getLastSeenMap();
    const lastSeen = map[conv.conversationId];
    if (!lastSeen) return true;
    return new Date(conv.lastMessageTime) > new Date(lastSeen);
};

// Fetch conversations and compute unread count from localStorage
const fetchUnreadCountFromConversations = async (email) => {
    try {
        const res = await fetch(`http://localhost:5000/api/conversations/${email}`);
        const data = await res.json();
        if (!Array.isArray(data)) return 0;
        return data.filter(isConversationUnread).length;
    } catch {
        return 0;
    }
};

// ─── Custom Alert Popup ───────────────────────────────────────────────────────
const CustomAlert = ({ alert, onClose }) => {
    if (!alert) return null;

    const styles = {
        success: { color: '#16a34a', bg: '#f0fdf4', border: '#16a34a' },
        error:   { color: '#dc2626', bg: '#fef2f2', border: '#dc2626' },
        warning: { color: '#d97706', bg: '#fffbeb', border: '#d97706' },
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
        if (alert.type === 'warning') return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
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

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, subtitle, icon: Icon, iconColor, iconBg, onClick }) => (
    <div
        style={{
            background: 'white', borderRadius: '1rem', padding: '1.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s', borderLeft: `4px solid ${iconColor}`, cursor: 'pointer'
        }}
        onMouseOver={e => { e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseOut={e => { e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        onClick={onClick}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>{title}</h3>
            <div style={{ background: iconBg, padding: '0.5rem', borderRadius: '0.5rem' }}>
                <Icon size={20} style={{ color: iconColor }} />
            </div>
        </div>
        <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.5rem 0' }}>{value}</p>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{subtitle}</p>
    </div>
);

// ─── Organizer Event Card ─────────────────────────────────────────────────────
const OrganizerEventCard = ({ event, onViewDetails }) => {
    const approvedCount = (event.registrations || []).filter(r => r.status === 'approved').length;
    const progressPct = Math.min(((approvedCount || 0) / event.volunteersNeeded) * 100, 100);
    const statusColors = {
        pending:   { color: '#d97706', bg: '#fffbeb' },
        active:    { color: '#10b981', bg: '#d1fae5' },
        completed: { color: '#6b7280', bg: '#f3f4f6' },
        cancelled: { color: '#ef4444', bg: '#fef2f2' },
    };
    const sc = statusColors[event.status] || statusColors.active;

    return (
        <div
            style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s' }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: 0, flex: 1, paddingRight: '0.5rem' }}>{event.eventName}</h3>
                <span style={{ padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', color: sc.color, background: sc.bg, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {event.status}
                </span>
            </div>
            {event.category && (
                <div style={{ marginBottom: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', border: '1px solid #67e8f9', color: '#0891b2', background: '#cffafe' }}>
                        {event.category}
                    </span>
                </div>
            )}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#6b7280' }}>
                        <Users size={14} style={{ color: '#3b82f6' }} /><span>Volunteers</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#111827' }}>{approvedCount} / {event.volunteersNeeded}</span>
                </div>
                <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '9999px', height: '6px' }}>
                    <div style={{ width: `${progressPct}%`, background: 'linear-gradient(to right, #3b82f6, #10b981)', borderRadius: '9999px', height: '6px', transition: 'width 0.3s' }} />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#374151' }}>
                    <Calendar size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                    <span>{`${new Date(event.startdate).toLocaleDateString('en-GB')} – ${new Date(event.enddate).toLocaleDateString('en-GB')}`}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#374151' }}>
                    <Clock size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span>{`${new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} – ${new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#374151' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ flexShrink: 0 }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.location}</span>
                </div>
            </div>
            <button
                onClick={() => onViewDetails(event._id)}
                style={{ width: '100%', padding: '0.65rem', background: 'linear-gradient(to right, #3b82f6, #10b981)', color: 'white', fontWeight: '600', fontSize: '0.875rem', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                onMouseOver={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                View Details & Manage
            </button>
        </div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const OrganizerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');
    const [modalOpen, setModalOpen] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [organizerId, setOrganizerId] = useState(null);
    const [organizerName, setOrganizerName] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMessagesTab, setShowMessagesTab] = useState(false);
    const [alertState, setAlertState] = useState(null);

    // Badge count — driven by MessagesTab via onUnreadCountChange
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    const [formData, setFormData] = useState({
        eventName: '', description: '', startdate: '', enddate: '',
        location: '', volunteersNeeded: '', category: '',
        startTime: '', endTime: '', requirements: ''
    });

    const showAlert = (message, type = 'info', title = '', onClose = null) => setAlertState({ message, type, title, onClose });
    const handleAlertClose = () => {
        const cb = alertState?.onClose;
        setAlertState(null);
        if (cb) cb();
    };

    // Auth check
    useEffect(() => {
        const userStr = localStorage.getItem('loggedInUser');
        if (!userStr) { navigate('/login'); return; }
        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'organizer') {
                showAlert('This page is for organizers only.', 'error', 'Access Denied', () => navigate('/login'));
                return;
            }
            if (user.id) {
                setOrganizerId(user.id);
                setOrganizerName(user.name || 'Organization');
            } else {
                showAlert('User ID not found. Please login again.', 'error', 'Authentication Error', () => navigate('/login'));
            }
        } catch { navigate('/login'); }
    }, [navigate]);

    // Fetch events
    useEffect(() => {
        if (organizerId) fetchEvents();
    }, [organizerId]);

    // ── Initial unread count on load (before MessagesTab mounts) ──────────────
    useEffect(() => {
        if (!organizerId) return;
        fetchUnreadCountFromConversations(organizerId).then(setUnreadMessagesCount);

        // Socket: when a new message arrives refresh the count from conversations
        socket.emit('join', organizerId);
        socket.on('unread_count_update', () => {
            // Re-derive from actual conversation data so it stays accurate
            fetchUnreadCountFromConversations(organizerId).then(setUnreadMessagesCount);
        });
        return () => { socket.off('unread_count_update'); };
    }, [organizerId]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/organizer/${organizerId}`);
            setEvents(response.data);
        } catch (error) {
            if (error.response?.status !== 404) showAlert('Failed to load events. Please try again.', 'error', 'Error');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const requiredFields = ['eventName', 'description', 'startdate', 'enddate', 'location', 'volunteersNeeded', 'category', 'startTime', 'endTime'];
        for (const f of requiredFields) {
            if (!String(formData[f] ?? '').trim()) {
                showAlert('Please fill in all required fields.', 'warning', 'Incomplete Form'); return;
            }
        }
        if (isNaN(Number(formData.volunteersNeeded)) || Number(formData.volunteersNeeded) <= 0) {
            showAlert('Please enter a valid number of volunteers needed.', 'warning', 'Invalid Input'); return;
        }
        const startDateTime = new Date(`${formData.startdate}T${formData.startTime || '00:00'}`);
        const endDateTime   = new Date(`${formData.enddate}T${formData.endTime || '00:00'}`);
        if (endDateTime < startDateTime) { showAlert('The event end must come after the start.', 'warning', 'Invalid Date Range'); return; }
        if (formData.startdate === formData.enddate && (endDateTime - startDateTime) / 60000 < 15) {
            showAlert('End time must be at least 15 minutes after start time on the same day.', 'warning', 'Invalid Time Range'); return;
        }
        try {
            await axios.post(API_URL, { organizerId, ...formData });
            await fetchEvents();
            setShowCreateModal(false);
            setFormData({ eventName: '', description: '', startdate: '', enddate: '', location: '', volunteersNeeded: '', category: '', startTime: '', endTime: '', requirements: '' });
            setTimeout(() => showAlert('Event created successfully!', 'success', 'Success!'), 300);
        } catch (error) {
            showAlert(error.response?.data?.message || 'Failed to create event.', 'error', 'Error');
        }
    };

    const handleLogout = () => { localStorage.removeItem('loggedInUser'); navigate('/login'); };
    const handleAnnouncements = () => navigate('/announcements');
    const handleViewDetails = (eventId) => navigate(`/event-details/${eventId}`);
    const getFilteredEvents = () => events.filter(e => e.status === activeTab);
    const getStats = () => ({
        activeEvents:    events.filter(e => e.status === 'active').length,
        totalVolunteers: events.reduce((sum, e) => sum + (e.registrations || []).filter(r => r.status === 'approved').length, 0),
        totalEvents:     events.length,
    });
    const getEmptyState = () => {
        if (activeTab === 'pending')   return { title: 'No events pending approval', desc: 'Events you create will appear here while awaiting admin approval' };
        if (activeTab === 'completed') return { title: 'No completed events yet',    desc: 'Events that have finished will appear here for your records' };
        return { title: 'No active events yet', desc: 'Create your first volunteer event and start making an impact in your community' };
    };

    if (loading || !organizerId) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading...</p>
            </div>
        );
    }

    const stats = getStats();
    const filteredEvents = getFilteredEvents();
    const emptyState = getEmptyState();

    const statCards = [
        { id: 'active-events',    title: 'Active Events',    value: String(stats.activeEvents),    subtitle: 'Currently recruiting',  icon: Calendar,   iconColor: '#3b82f6', iconBg: '#dbeafe', modal: <ActiveEventsOrganizerModal events={events} /> },
        { id: 'total-volunteers', title: 'Total Volunteers', value: String(stats.totalVolunteers), subtitle: 'Across all events',     icon: Users,      iconColor: '#10b981', iconBg: '#d1fae5', modal: <TotalVolunteersOrganizerModal events={events} /> },
        { id: 'events-created',   title: 'Events Created',   value: String(stats.totalEvents),     subtitle: 'Lifetime total',        icon: TrendingUp, iconColor: '#06b6d4', iconBg: '#cffafe', modal: <EventsCreatedModal events={events} /> },
    ];

    const tabStyle = (tab) => ({
        padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.3s',
        background: activeTab === tab ? 'white' : 'transparent',
        color: activeTab === tab ? '#111827' : '#4b5563',
        boxShadow: activeTab === tab ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
    });

    const inputStyle = {
        width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb',
        borderRadius: '0.75rem', fontSize: '0.95rem', outline: 'none',
        transition: 'all 0.2s', boxSizing: 'border-box',
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)' }}>
            <CustomAlert alert={alertState} onClose={handleAlertClose} />

            {/* ── Navbar ── */}
            <nav style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '0 2rem', height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Organization Dashboard</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{organizerName}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', background: '#d1fae5', color: '#059669', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600', marginRight: '0.75rem' }}>
                        <span style={{ width: '7px', height: '7px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }} />
                        Active
                    </div>

                    {/* ── Messages button with red badge ── */}
                    <button
                        onClick={() => setShowMessagesTab(prev => !prev)}
                        style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', color: '#4b5563', fontWeight: '500', fontSize: '0.875rem', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <MessageCircle size={18} />
                        <span>Messages</span>
                        {unreadMessagesCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '0.2rem', right: '0.2rem',
                                minWidth: '1.25rem', height: '1.25rem',
                                background: '#ef4444', color: 'white',
                                fontSize: '0.7rem', fontWeight: '700',
                                borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '0 0.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', pointerEvents: 'none',
                            }}>
                                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleAnnouncements}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', color: '#4b5563', fontWeight: '500', fontSize: '0.875rem', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <Megaphone size={18} />
                        <span>Announcements</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', color: '#4b5563', fontWeight: '500', fontSize: '0.875rem', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* ── Main Content ── */}
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>

                {/* Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {statCards.map(sc => (
                        <StatCard key={sc.id} title={sc.title} value={sc.value} subtitle={sc.subtitle} icon={sc.icon} iconColor={sc.iconColor} iconBg={sc.iconBg} onClick={() => setModalOpen(sc.id)} />
                    ))}
                </div>

                {/* Modals */}
                {statCards.map(sc => (
                    <Modal key={sc.id} isOpen={modalOpen === sc.id} onClose={() => setModalOpen(null)} title={sc.title}>
                        {sc.modal}
                    </Modal>
                ))}

                {/* Tabs + Create Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {['active', 'pending', 'completed'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(tab)}
                                    onMouseOver={e => { if (activeTab !== tab) e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; }}
                                    onMouseOut={e => { if (activeTab !== tab) e.currentTarget.style.background = 'transparent'; }}
                            >
                                {tab === 'active' ? 'Active Events' : tab === 'pending' ? 'Pending Approval' : 'Completed'}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(to right, #3b82f6, #10b981)', color: 'white', fontWeight: '600', fontSize: '0.95rem', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s' }}
                        onMouseOver={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <Plus size={20} /> Create Event
                    </button>
                </div>

                {/* ── Messages inline panel ── */}
                {showMessagesTab && (
                    <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Messages</h2>
                            <button onClick={() => setShowMessagesTab(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                                <X size={22} />
                            </button>
                        </div>
                        {/*
                            onUnreadCountChange: MessagesTab calls this whenever the unread
                            count changes (conversation clicked → count drops by 1, etc.)
                        */}
                        <MessagesTab
                            currentUser={{ email: organizerId, role: 'organizer', fullName: organizerName }}
                            onUnreadCountChange={setUnreadMessagesCount}
                        />
                    </div>
                )}

                {/* Event Cards */}
                {filteredEvents.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {filteredEvents.map(event => (
                            <OrganizerEventCard key={event._id} event={event} onViewDetails={handleViewDetails} />
                        ))}
                    </div>
                ) : (
                    <div style={{ background: 'white', borderRadius: '1rem', padding: '4rem 2rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '3.5rem', height: '3.5rem', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                            <Calendar size={28} style={{ color: '#3b82f6' }} />
                        </div>
                        <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>{emptyState.title}</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem 0', maxWidth: '24rem' }}>{emptyState.desc}</p>
                        {activeTab === 'active' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(to right, #3b82f6, #10b981)', color: 'white', fontWeight: '600', fontSize: '0.875rem', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                            >
                                <Plus size={18} /> Create Event
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ── Create Event Modal ── */}
            {showCreateModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)', padding: '1rem' }}
                     onClick={e => { if (e.target === e.currentTarget) setShowCreateModal(false); }}
                >
                    <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', maxWidth: '720px', width: '100%', maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '2.75rem', height: '2.75rem', background: '#dbeafe', borderRadius: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Calendar size={22} style={{ color: '#3b82f6' }} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Create New Event</h2>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Post a new volunteer opportunity</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '0.25rem' }}>
                                <X size={22} />
                            </button>
                        </div>

                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Event Title *</label>
                                <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} placeholder="Enter event name" style={inputStyle}
                                       onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                       onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your volunteer event" rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                                          onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                          onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                            </div>

                            {/* Date + Time Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {[
                                    { label: 'Start Date *', name: 'startdate', type: 'date' },
                                    { label: 'End Date *',   name: 'enddate',   type: 'date' },
                                ].map(field => (
                                    <div key={field.name}>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>{field.label}</label>
                                        <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleInputChange} style={inputStyle}
                                               onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                               onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                ))}
                                {[
                                    { label: 'Start Time *', name: 'startTime', id: 'startTimeInput' },
                                    { label: 'End Time *',   name: 'endTime',   id: 'endTimeInput'   },
                                ].map(field => (
                                    <div key={field.name}>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>{field.label}</label>
                                        <div style={{ position: 'relative' }}>
                                            <input id={field.id} type="time" name={field.name} value={formData[field.name]} onChange={handleInputChange}
                                                   style={{ ...inputStyle, paddingRight: '2.5rem' }}
                                                   onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                                   onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                            />
                                            <button type="button"
                                                    onClick={() => { const input = document.getElementById(field.id); if (input.showPicker) input.showPicker(); else input.focus(); }}
                                                    style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#6b7280' }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Location *</label>
                                <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Event location" style={inputStyle}
                                       onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                       onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Category *</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                                            onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                            onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <option value="">Select category</option>
                                        <option value="education">Education</option>
                                        <option value="environment">Environment</option>
                                        <option value="health">Health</option>
                                        <option value="community">Community</option>
                                        <option value="distribution">Distribution</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Volunteers Needed *</label>
                                    <input type="number" name="volunteersNeeded" value={formData.volunteersNeeded} onChange={handleInputChange} min="1" placeholder="Number of volunteers" style={inputStyle}
                                           onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                           onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Requirements</label>
                                <textarea name="requirements" value={formData.requirements} onChange={handleInputChange} placeholder="Any specific requirements or skills needed" rows={2} style={{ ...inputStyle, resize: 'vertical' }}
                                          onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                          onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' }}>
                                <button onClick={() => setShowCreateModal(false)}
                                        style={{ padding: '0.65rem 1.5rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontWeight: '600', color: '#374151', cursor: 'pointer', fontSize: '0.875rem' }}
                                        onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                                        onMouseOut={e => e.currentTarget.style.background = 'white'}
                                >
                                    Cancel
                                </button>
                                <button onClick={handleSubmit}
                                        style={{ padding: '0.65rem 1.75rem', background: 'linear-gradient(to right, #3b82f6, #10b981)', color: 'white', fontWeight: '600', fontSize: '0.875rem', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}
                                        onMouseOver={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                        onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    Create Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizerDashboard;