import React, { useState } from 'react';
import { CheckCircle, Clock, Calendar, TrendingUp, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, ChevronDown } from 'lucide-react';
import Navbar from './Navbar';
import StatCard from './StatCard';
import EventCard from './EventCard';
import MyRegistrations from "./MyRegistrations.jsx";
import Modal from './Modal';
import EventsCompletedModal from './EventsCompletedModal';
import HoursVolunteeredModal from './HoursVolunteeredModal';
import ActiveRegistrationModal from './ActiveRegistrationModal';
import SkillsUtilizedModal from './SkillsUtilizedModal';
import MessagesTab from './MessageTab';
import CopilotPanel from '../components/CopilotPanel';
import io from 'socket.io-client';
import LogoutPopup from './LogoutPopup';
const socket = io('http://localhost:5000');

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

// ─── Helper: fetch unread count without mounting the tab component ─────────
const fetchUnreadAnnouncementsCount = async (userEmail) => {
    try {
        if (!userEmail) return 0;
        const regRes = await fetch(`http://localhost:5000/api/events/volunteer/${userEmail}/registrations`);
        const regData = await regRes.json();
        if (!regData.success) return 0;

        const approvedEventIds = regData.registrations
            .filter(r => r.registrationStatus === 'approved')
            .map(r => r.event._id);

        const readIds = new Set(
            JSON.parse(localStorage.getItem('readAnnouncementIds') || '[]')
        );

        let unread = 0;
        for (const eventId of approvedEventIds) {
            try {
                const res = await fetch(`http://localhost:5000/api/events/${eventId}/announcements`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    data.forEach(a => {
                        if (!readIds.has(String(a._id || a.id))) unread++;
                    });
                }
            } catch { /* skip */ }
        }
        return unread;
    } catch (err) {
        console.error('fetchUnreadAnnouncementsCount error:', err);
        return 0;
    }
};

// ─── Helper: fetch unread CONVERSATIONS count (not messages) ─────────────────
const fetchUnreadConversationsCount = async (userEmail) => {
    try {
        if (!userEmail) return 0;

        // Fetch conversations
        const response = await fetch(`http://localhost:5000/api/conversations/${userEmail}`);
        const conversations = await response.json();

        if (!Array.isArray(conversations)) return 0;

        // Get last seen map from localStorage (same as MessagesTab)
        const STORAGE_KEY = 'msgLastSeen';
        const getLastSeenMap = () => {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            } catch {
                return {};
            }
        };

        const lastSeenMap = getLastSeenMap();

        // Count conversations with new messages
        const unreadCount = conversations.filter(conv => {
            if (!conv.lastMessageTime) return false;
            const lastSeen = lastSeenMap[conv.conversationId];
            if (!lastSeen) return true; // never opened
            return new Date(conv.lastMessageTime) > new Date(lastSeen);
        }).length;

        return unreadCount;
    } catch (err) {
        console.error('fetchUnreadConversationsCount error:', err);
        return 0;
    }
};

// ─── Helper: compute recommended events based on volunteer profile ─────────
// Matches events by skills/requirements keywords and location.
// Returns scored & sorted list, capped at `maxCount`.
const getRecommendedEvents = (events, volunteerProfile, registeredEventIds, maxCount = 4) => {
    if (!events || events.length === 0) return [];

    // Extract volunteer skills and location from profile
    // Profile fields may vary; we normalise to lowercase strings for matching.
    const profileSkills = Object.keys(volunteerProfile?.skills || {})
        .join(' ')
        .toLowerCase()
        .split(/[\s,;]+/)
        .filter(Boolean);

    const profileLocation = (volunteerProfile?.address || '').toLowerCase();

    const scoredEvents = events
        .filter(event => !registeredEventIds.has(event._id)) // exclude already-registered
        .map(event => {
            let score = 0;
            const reasons = [];

            // ── Location match ──────────────────────────────────────────
            const eventLocation = (event.location || '').toLowerCase();
            if (profileLocation && eventLocation) {
                // Check if any word from the volunteer's location appears in event location
                const locationWords = profileLocation.split(/[\s,]+/).filter(w => w.length > 2);
                const locationMatch = locationWords.some(word => eventLocation.includes(word));
                if (locationMatch) {
                    score += 3;
                    reasons.push('Near you');
                }
            }

            // ── Skills / requirements match ────────────────────────────
            const eventText = [
                event.requirements || '',
                event.category || '',
                event.description || '',
                event.eventName || '',
            ].join(' ').toLowerCase();

            let skillMatchCount = 0;
            profileSkills.forEach(skill => {
                if (skill.length > 2 && eventText.includes(skill)) {
                    skillMatchCount++;
                }
            });

            if (skillMatchCount > 0) {
                score += Math.min(skillMatchCount * 2, 6); // cap skill score at 6
                reasons.push('Matches your skills');
            }

            // ── Category preference (based on past registrations handled externally) ─
            // Small base score so events still surface even with no profile data
            score += 0.5;

            return { event, score, reasons };
        })
        .filter(item => item.score > 0.5) // only include events with at least one real match
        .sort((a, b) => b.score - a.score)
        .slice(0, maxCount);

    return scoredEvents;
};


// ─── Announcements Tab Component ──────────────────────────────────────────
const VolunteerAnnouncements = ({ onUnreadCountChange }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [readIds, setReadIds] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem('readAnnouncementIds') || '[]'));
        } catch {
            return new Set();
        }
    });
    const [loading, setLoading] = useState(true);

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    React.useEffect(() => {
        fetchAnnouncements();
    }, []);

    React.useEffect(() => {
        const unread = announcements.filter(a => !readIds.has(String(a._id || a.id))).length;
        if (onUnreadCountChange) onUnreadCountChange(unread);
    }, [announcements, readIds]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            if (!loggedInUser?.email) return;

            const registrationsResponse = await fetch(
                `http://localhost:5000/api/events/volunteer/${loggedInUser.email}/registrations`
            );

            const registrationsData = await registrationsResponse.json();

            if (registrationsData.success) {
                const approvedEventIds = registrationsData.registrations
                    .filter(reg => reg.registrationStatus === 'approved')
                    .map(reg => reg.event._id);

                const allAnnouncements = [];

                for (const eventId of approvedEventIds) {
                    try {
                        const announcementsResponse = await fetch(
                            `http://localhost:5000/api/events/${eventId}/announcements`
                        );
                        const announcementsData = await announcementsResponse.json();
                        const event = registrationsData.registrations.find(r => r.event._id === eventId)?.event;

                        if (announcementsData && announcementsData.length > 0) {
                            announcementsData.forEach(announcement => {
                                allAnnouncements.push({
                                    ...announcement,
                                    eventId: eventId,
                                    eventName: event?.eventName || 'Unknown Event',
                                    type: 'announcement'
                                });
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching announcements for event ${eventId}:`, error);
                    }
                }

                allAnnouncements.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
                setAnnouncements(allAnnouncements);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = (announcement) => {
        const id = String(announcement._id || announcement.id);
        if (readIds.has(id)) return;
        const updated = new Set(readIds);
        updated.add(id);
        setReadIds(updated);
        localStorage.setItem('readAnnouncementIds', JSON.stringify([...updated]));
    };

    const markAllAsRead = () => {
        const updated = new Set([...readIds, ...announcements.map(a => String(a._id || a.id))]);
        setReadIds(updated);
        localStorage.setItem('readAnnouncementIds', JSON.stringify([...updated]));
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const unreadCount = announcements.filter(a => !readIds.has(String(a._id || a.id))).length;

    if (loading) {
        return (
            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', background: '#3b82f6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M16.9992 2.00312V5.26212C17.3932 5.26212 17.7833 5.33972 18.1472 5.49049C18.5112 5.64125 18.8419 5.86223 19.1205 6.1408C19.3991 6.41938 19.6201 6.7501 19.7708 7.11407C19.9216 7.47805 19.9992 7.86816 19.9992 8.26213C19.9992 8.65609 19.9216 9.0462 19.7708 9.41018C19.6201 9.77415 19.3991 10.1049 19.1205 10.3834C18.8419 10.662 18.5112 10.883 18.1472 11.0338C17.7833 11.1845 17.3932 11.2621 16.9992 11.2621V14.2621C16.9992 15.9101 15.1182 16.8511 13.7992 15.8621L11.7392 14.3161C10.638 13.4906 9.35593 12.9393 7.9992 12.7081V15.5521C7.99931 16.2059 7.76309 16.8376 7.3341 17.3309C6.9051 17.8242 6.31225 18.1458 5.66481 18.2364C5.01738 18.327 4.35902 18.1805 3.81108 17.824C3.26314 17.4674 2.86257 16.9248 2.6832 16.2961L1.1132 10.8001C0.548217 10.1329 0.180535 9.32134 0.0514852 8.45663C-0.0775649 7.59193 0.0371319 6.70836 0.382683 5.90526C0.728234 5.10216 1.29094 4.41137 2.00755 3.91052C2.72416 3.40968 3.56626 3.11864 4.4392 3.07012L7.4572 2.90212C8.93384 2.8201 10.3699 2.3886 11.6472 1.64312L13.9912 0.275125C15.3252 -0.501875 16.9992 0.459125 16.9992 2.00312Z" fill="white"/>
                        </svg>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Announcements</h2>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                            {unreadCount > 0
                                ? `${unreadCount} unread • ${announcements.length} total`
                                : `${announcements.length} announcement${announcements.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#eff6ff',
                            color: '#3b82f6',
                            border: '1px solid #bfdbfe',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = '#dbeafe'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#eff6ff'; }}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Announcements List */}
            {announcements.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {announcements.map((announcement, index) => {
                        const id = String(announcement._id || announcement.id);
                        const isRead = readIds.has(id);
                        return (
                            <div
                                key={id || index}
                                onClick={() => markAsRead(announcement)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '0.75rem',
                                    border: isRead ? '1px solid #e5e7eb' : '2px solid #93c5fd',
                                    background: isRead ? '#f9fafb' : 'linear-gradient(to right, #eff6ff, #f0f9ff)',
                                    cursor: isRead ? 'default' : 'pointer',
                                    transition: 'all 0.2s',
                                    position: 'relative',
                                }}
                                onMouseOver={e => {
                                    if (!isRead) {
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.15)';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {!isRead && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        width: '10px',
                                        height: '10px',
                                        background: '#3b82f6',
                                        borderRadius: '50%',
                                    }} />
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem', paddingRight: isRead ? 0 : '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: isRead ? '600' : '700', color: '#111827' }}>{announcement.title}</span>
                                        <span style={{ fontSize: '0.75rem', background: '#3b82f6', color: 'white', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                                            {announcement.eventName}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{formatDate(announcement.sentAt)}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: isRead ? '#6b7280' : '#374151', margin: '0 0 0.5rem 0' }}>{announcement.message}</p>

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    {!isRead ? (
                                        <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: '600' }}>Click to mark as read</span>
                                    ) : (
                                        <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                            Read
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', textAlign: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>No announcements yet</p>
                </div>
            )}
        </div>
    );
};


const VolunteerDashboard = () => {
    const [activeTab, setActiveTab] = useState('discover');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Category');
    const [allEvents, setAllEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [modalOpen, setModalOpen] = useState(null);
    const [unreadAnnouncementsCount, setUnreadAnnouncementsCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    // ─── Track event IDs the user has already registered for ─────────────────
    const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
    // ─── Volunteer profile for recommendations ────────────────────────────────
    const [volunteerProfile, setVolunteerProfile] = useState(null);

    // ─── Custom alert state ───────────────────────────────────────────────────
    const [alertState, setAlertState] = useState(null);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const showAlert = (message, type = 'info', title = '', onClose = null) => {
        setAlertState({ message, type, title, onClose });
    };

    const handleAlertClose = () => {
        const cb = alertState?.onClose;
        setAlertState(null);
        if (cb) cb();
    };
    // ─────────────────────────────────────────────────────────────────────────

    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    React.useEffect(() => {
        if (loggedInUser?.email) {
            fetchUnreadAnnouncementsCount(loggedInUser.email).then(count => {
                setUnreadAnnouncementsCount(count);
            });
        }
    }, []);

    const [completedEventsCount, setCompletedEventsCount] = useState(0);
    React.useEffect(() => {
        const fetchCompletedCount = async () => {
            try {
                if (!loggedInUser?.email) return;
                const res = await fetch(`http://localhost:5000/api/events/volunteer/${loggedInUser.email}/registrations`);
                const data = await res.json();
                if (data.success) {
                    const count = data.registrations.filter(
                        reg => reg.registrationStatus === 'approved' &&
                            reg.event.status == 'completed' &&
                            reg.event.status !== 'cancelled'
                    ).length;
                    setCompletedEventsCount(count);
                }
            } catch (err) {
                console.error('Error fetching completed events count:', err);
            }
        };
        fetchCompletedCount();
    }, []);

    const [totalHoursVolunteered, setTotalHoursVolunteered] = useState(0);
    React.useEffect(() => {
        const fetchTotalHours = async () => {
            try {
                if (!loggedInUser?.email) return;
                const res = await fetch(`http://localhost:5000/api/events/volunteer/${loggedInUser.email}/registrations`);
                const data = await res.json();
                if (data.success) {
                    const total = data.registrations
                        .filter(reg => reg.registrationStatus === 'approved' && reg.event.status === 'completed')
                        .reduce((sum, { event }) => {
                            if (!event.startTime || !event.endTime) return sum;
                            const [sh, sm] = event.startTime.split(':').map(Number);
                            const [eh, em] = event.endTime.split(':').map(Number);
                            const dailyMins = (eh * 60 + em) - (sh * 60 + sm);
                            if (dailyMins <= 0) return sum;

                            const start = new Date(event.startdate);
                            const end = new Date(event.enddate || event.startdate);
                            const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

                            return sum + (dailyMins / 60) * days;
                        }, 0);
                    setTotalHoursVolunteered(Math.round(total * 10) / 10);
                }
            } catch (err) {
                console.error('Error fetching total hours:', err);
            }
        };
        fetchTotalHours();
    }, []);

    const [activeRegistrationsCount, setActiveRegistrationsCount] = useState(0);
    React.useEffect(() => {
        const fetchActiveCount = async () => {
            try {
                if (!loggedInUser?.email) return;
                const res = await fetch(`http://localhost:5000/api/events/volunteer/${loggedInUser.email}/registrations`);
                const data = await res.json();
                if (data.success) {
                    const count = data.registrations.filter(
                        reg => reg.registrationStatus === 'approved' &&
                            reg.event.status !== 'completed' &&
                            reg.event.status !== 'cancelled'
                    ).length;
                    setActiveRegistrationsCount(count);
                }
            } catch (err) {
                console.error('Error fetching active registrations count:', err);
            }
        };
        fetchActiveCount();
    }, []);

    // ─── Fetch unread CONVERSATIONS count (not individual messages) ──────────
    const fetchUnreadCount = async () => {
        try {
            const count = await fetchUnreadConversationsCount(loggedInUser.email);
            setUnreadMessagesCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    React.useEffect(() => {
        if (loggedInUser) {
            socket.emit('join', loggedInUser.email);
            fetchUnreadCount();

            // When new message arrives, recalculate unread conversations
            socket.on('new_message', () => {
                fetchUnreadCount();
            });

            socket.on('unread_count_update', () => {
                fetchUnreadCount();
            });

            return () => {
                socket.off('new_message');
                socket.off('unread_count_update');
            };
        }
    }, [loggedInUser]);

    React.useEffect(() => {
        const handleOpenChat = () => {
            setActiveTab('messages');
        };

        window.addEventListener('openChat', handleOpenChat);

        return () => {
            window.removeEventListener('openChat', handleOpenChat);
        };
    }, []);

    React.useEffect(() => {
        const userType = loggedInUser?.role || loggedInUser?.type;
        if (!loggedInUser || userType !== "volunteer") {
            navigate("/login");
        }
    }, [activeTab]);

    const handleProfileClick = () => {
        navigate('/volunteer-profile');
    };
    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
        setTimeout(() => {
            setShowLogoutPopup(false);
            localStorage.removeItem("loggedInUser");
            navigate('/login');
        }, 1500);
    };

    const stats = [
        {
            id: 'events',
            title: 'Events Completed',
            value: completedEventsCount.toString(),
            subtitle: 'Successfully completed',
            icon: CheckCircle,
            iconColor: '#3b82f6',
            iconBg: '#dbeafe',
            modalTitle: 'Completed Events',
            modalContent: <EventsCompletedModal />
        },
        {
            id: 'hours',
            title: 'Hours Volunteered',
            value: totalHoursVolunteered.toString(),
            subtitle: 'Hours contributed',
            icon: Clock,
            iconColor: '#10b981',
            iconBg: '#d1fae5',
            modalTitle: 'Volunteer Hours',
            modalContent: <HoursVolunteeredModal />
        },
        {
            id: 'registration',
            title: 'Active Registration',
            value: activeRegistrationsCount.toString(),
            subtitle: 'Upcoming events',
            icon: Calendar,
            iconColor: '#06b6d4',
            iconBg: '#cffafe',
            modalTitle: 'Active Registrations',
            modalContent: <ActiveRegistrationModal />
        }
    ];

    // ─── Fetch volunteer profile for recommendations ───────────────────────────
    React.useEffect(() => {
        const fetchVolunteerProfile = async () => {
            try {
                if (!loggedInUser?.email) return;
                // Try fetching the volunteer's full profile — adjust the endpoint to match your API
                const res = await fetch(`http://localhost:5000/api/profile/${loggedInUser.email}`);
                if (res.ok) {
                    const data = await res.json();
                    // Merge profile data with what's already stored in loggedInUser
                    setVolunteerProfile({ ...loggedInUser, ...data });
                } else {
                    // Fallback: use loggedInUser fields directly (name, location, skills, etc.)
                    setVolunteerProfile(loggedInUser);
                }
            } catch (err) {
                // Fallback gracefully — still use loggedInUser
                setVolunteerProfile(loggedInUser);
            }
        };
        fetchVolunteerProfile();
    }, []);

    // ─── Fetch the volunteer's existing registrations on mount ────────────────
    React.useEffect(() => {
        const fetchUserRegistrations = async () => {
            try {
                if (!loggedInUser?.email) return;
                const res = await fetch(`http://localhost:5000/api/events/volunteer/${loggedInUser.email}/registrations`);
                const data = await res.json();
                if (data.success) {
                    const ids = new Set(data.registrations.map(r => r.event._id));
                    setRegisteredEventIds(ids);
                }
            } catch (err) {
                console.error('Error fetching user registrations:', err);
            }
        };
        fetchUserRegistrations();
    }, []);

    // Load all events from backend API on mount
    React.useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/events');

                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }

                const events = await response.json();

                const approvedEvents = events.filter(event =>
                    event.isApproved === true && event.status === 'active'
                );

                setAllEvents(approvedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                showAlert('Failed to load events. Please try refreshing the page.', 'error', 'Load Error');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // ─── Recompute recommended events whenever events, profile, or registrations change ──
    React.useEffect(() => {
        if (allEvents.length === 0) return;
        const scored = getRecommendedEvents(allEvents, volunteerProfile, registeredEventIds, 4);
        setRecommendedEvents(scored);
    }, [allEvents, volunteerProfile, registeredEventIds]);

    // ─── Filter: exclude registered events + apply search/category ───────────
    const handleFilter = () => {
        let filtered = allEvents.filter(event => !registeredEventIds.has(event._id));

        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(event =>
                event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (event.requirements && event.requirements.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (selectedCategory !== 'All Category') {
            filtered = filtered.filter(event => {
                return event.category?.toLowerCase() === selectedCategory.toLowerCase() ||
                    (event.requirements && event.requirements.toLowerCase().includes(selectedCategory.toLowerCase()));
            });
        }

        setFilteredEvents(filtered);
    };

    React.useEffect(() => {
        handleFilter();
    }, [searchQuery, selectedCategory, allEvents, registeredEventIds]);

    // ─── Called by EventCard after a successful registration ─────────────────
    const handleEventRegistered = (eventId) => {
        setRegisteredEventIds(prev => {
            const updated = new Set(prev);
            updated.add(eventId);
            return updated;
        });
        refreshEvents();
    };

    const refreshEvents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/events');
            if (response.ok) {
                const events = await response.json();
                const approvedEvents = events.filter(event =>
                    event.isApproved === true && event.status === 'active'
                );
                setAllEvents(approvedEvents);
            }
        } catch (error) {
            console.error('Error refreshing events:', error);
        }
    };

    return (
        <>
            <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)' }}>
                {/* Custom Alert Popup */}
                <CustomAlert alert={alertState} onClose={handleAlertClose} />
                <LogoutPopup showLogout={showLogoutPopup} />
                {/* Navbar */}
                <Navbar
                    userName={loggedInUser?.name || "Volunteer"}
                    onProfileClick={handleProfileClick}
                    onLogoutClick={handleLogoutClick}
                />

                {/* Main Content */}
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        {stats.map((stat) => (
                            <StatCard
                                key={stat.id}
                                title={stat.title}
                                value={stat.value}
                                subtitle={stat.subtitle}
                                icon={stat.icon}
                                iconColor={stat.iconColor}
                                iconBg={stat.iconBg}
                                onClick={() => setModalOpen(stat.id)}
                            />
                        ))}
                    </div>

                    {/* Modals */}
                    {stats.map((stat) => (
                        <Modal
                            key={stat.id}
                            isOpen={modalOpen === stat.id}
                            onClose={() => setModalOpen(null)}
                            title={stat.modalTitle}
                        >
                            {stat.modalContent}
                        </Modal>
                    ))}

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setActiveTab('discover')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                background: activeTab === 'discover' ? 'white' : 'transparent',
                                color: activeTab === 'discover' ? '#111827' : '#4b5563',
                                boxShadow: activeTab === 'discover' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                            onMouseOver={(e) => { if (activeTab !== 'discover') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)' }}
                            onMouseOut={(e) => { if (activeTab !== 'discover') e.currentTarget.style.background = 'transparent' }}
                        >
                            Discover Events
                        </button>
                        <button
                            onClick={() => setActiveTab('registrations')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                background: activeTab === 'registrations' ? 'white' : 'transparent',
                                color: activeTab === 'registrations' ? '#111827' : '#4b5563',
                                boxShadow: activeTab === 'registrations' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                            onMouseOver={(e) => { if (activeTab !== 'registrations') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)' }}
                            onMouseOut={(e) => { if (activeTab !== 'registrations') e.currentTarget.style.background = 'transparent' }}
                        >
                            My Registrations
                        </button>

                        <button
                            onClick={() => setActiveTab('announcements')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                background: activeTab === 'announcements' ? 'white' : 'transparent',
                                color: activeTab === 'announcements' ? '#111827' : '#4b5563',
                                boxShadow: activeTab === 'announcements' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                                position: 'relative'
                            }}
                            onMouseOver={(e) => { if (activeTab !== 'announcements') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)' }}
                            onMouseOut={(e) => { if (activeTab !== 'announcements') e.currentTarget.style.background = 'transparent' }}
                        >
                            Announcements
                            {unreadAnnouncementsCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '0.25rem',
                                    right: '0.25rem',
                                    minWidth: '1.25rem',
                                    height: '1.25rem',
                                    background: '#ef4444',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    borderRadius: '9999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 0.25rem',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                }}>
                                {unreadAnnouncementsCount > 9 ? '9+' : unreadAnnouncementsCount}
                            </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('messages')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                background: activeTab === 'messages' ? 'white' : 'transparent',
                                color: activeTab === 'messages' ? '#111827' : '#4b5563',
                                boxShadow: activeTab === 'messages' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                                position: 'relative'
                            }}
                            onMouseOver={(e) => { if (activeTab !== 'messages') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)' }}
                            onMouseOut={(e) => { if (activeTab !== 'messages') e.currentTarget.style.background = 'transparent' }}
                        >
                            Messages
                            {unreadMessagesCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '0.25rem',
                                    right: '0.25rem',
                                    minWidth: '1.25rem',
                                    height: '1.25rem',
                                    background: '#ef4444',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    borderRadius: '9999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 0.25rem',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                }}>
                                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                            </span>
                            )}
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'registrations' && (
                        <div style={{
                            background: 'white',
                            borderRadius: '1rem',
                            padding: '2rem',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            marginBottom: '2rem'
                        }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#111827',
                                margin: '0 0 1.5rem 0'
                            }}>
                                My Registrations
                            </h2>
                            <MyRegistrations />
                        </div>
                    )}

                    {activeTab === 'announcements' && (
                        <VolunteerAnnouncements
                            onUnreadCountChange={(count) => setUnreadAnnouncementsCount(count)}
                        />
                    )}

                    {activeTab === 'messages' && (
                        <MessagesTab
                            currentUser={loggedInUser}
                            onUnreadCountChange={(count) => setUnreadMessagesCount(count)}
                        />
                    )}

                    {/* Show events only on Discover tab */}
                    {activeTab === 'discover' && (
                        <>
                            {loading ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '4rem',
                                    color: '#6b7280'
                                }}>
                                    <p style={{ fontSize: '1.125rem' }}>Loading events...</p>
                                </div>
                            ) : (
                                <>
                                    {/* ── Recommended For You Section ──────────────────────────── */}
                                    {recommendedEvents.length > 0 && (
                                        <div style={{ marginBottom: '2rem' }}>
                                            {/* Section header */}
                                            <div style={{
                                                background: 'linear-gradient(to right, #eff6ff, #eef2ff)',
                                                borderRadius: '1rem',
                                                padding: '1.5rem',
                                                marginBottom: '1.5rem',
                                                border: '1px solid #dbeafe',
                                                boxShadow: '0 10px 20px -3px rgba(0, 0, 0, 0.15)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                flexWrap: 'wrap',
                                                gap: '0.5rem'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Sparkles size={20} style={{ color: '#3b82f6' }} />
                                                    <div>
                                                        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                                            Recommended For You
                                                        </h2>
                                                        <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                                                            Events matching your skills and location
                                                        </p>
                                                    </div>
                                                </div>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    color: '#3b82f6',
                                                    fontWeight: '600',
                                                    background: 'white',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    border: '1px solid #bfdbfe',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                                }}>
                                                    {recommendedEvents.length} match{recommendedEvents.length !== 1 ? 'es' : ''}
                                                </span>
                                            </div>
                                            {/* Recommended event cards */}
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                                gap: '1.5rem',
                                                maxWidth: '100%'
                                            }}>
                                                {recommendedEvents.map(({ event, reasons }) => (
                                                    <div key={event._id} style={{ position: 'relative' }}>
                                                        {/* Match reason badge */}
                                                        {reasons && reasons.length > 0 && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '-0.5rem',
                                                                left: '1rem',
                                                                zIndex: 10,
                                                                display: 'flex',
                                                                gap: '0.375rem',
                                                                flexWrap: 'wrap'
                                                            }}>
                                                                {reasons.map((reason, i) => (
                                                                    <span key={i} style={{
                                                                        background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                                                                        color: 'white',
                                                                        fontSize: '0.65rem',
                                                                        fontWeight: '700',
                                                                        padding: '0.2rem 0.55rem',
                                                                        borderRadius: '9999px',
                                                                        boxShadow: '0 2px 6px rgba(99, 102, 241, 0.4)',
                                                                        letterSpacing: '0.02em',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.25rem'
                                                                    }}>
                                                                    <Sparkles size={8} />
                                                                        {reason}
                                                                </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div style={{ paddingTop: reasons && reasons.length > 0 ? '0.75rem' : '0' }}>
                                                            <EventCard
                                                                key={event._id}
                                                                eventId={event._id}
                                                                organizerId={event.organizerId}
                                                                title={event.eventName}
                                                                description={event.description}
                                                                tags={[
                                                                    { name: event.category || 'general', type: 'skill' },
                                                                    { name: `${event.volunteersNeeded - (event.registrations || []).filter(r => r.status === 'approved').length} spots left`, type: 'spots' }
                                                                ]}
                                                                date={`${new Date(event.startdate).toLocaleDateString('en-GB')} - ${new Date(event.enddate).toLocaleDateString('en-GB')}`}
                                                                time={`${new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString('en-US', {
                                                                    hour: 'numeric',
                                                                    minute: '2-digit',
                                                                    hour12: true
                                                                })} - ${new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString('en-US', {
                                                                    hour: 'numeric',
                                                                    minute: '2-digit',
                                                                    hour12: true
                                                                })}`}
                                                                location={event.location}
                                                                requirements={event.requirements || 'No specific requirements'}
                                                                onRegister={handleEventRegistered}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Search and Filter Section */}
                                    <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ flex: 1, position: 'relative' }}>
                                                <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
                                                <input
                                                    type="text"
                                                    placeholder="Search events"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '1rem', outline: 'none', transition: 'all 0.2s' }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = '#3b82f6';
                                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>

                                            <div style={{ position: 'relative', width: '200px', minWidth: '200px' }}>
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '1rem', background: 'white', cursor: 'pointer', appearance: 'none', outline: 'none', transition: 'all 0.2s' }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = '#3b82f6';
                                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <option>All Category</option>
                                                    <option>Teaching</option>
                                                    <option>First Aid/Medical</option>
                                                    <option>Media/Photography</option>
                                                    <option>Technical Support</option>
                                                    <option>Animal Rescue/Care</option>
                                                    <option>Distribution</option>
                                                    <option>Event Logistics</option>
                                                    <option>Other</option>
                                                </select>
                                                <ChevronDown style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* All Events Section */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>All Events</h2>
                                        <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                                        {filteredEvents.length} {filteredEvents.length === 1 ? 'opportunity' : 'opportunities'}
                                    </span>
                                    </div>

                                    {/* Event Cards */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '100%' }}>
                                        {filteredEvents.map((event) => (
                                            <EventCard
                                                key={event._id}
                                                eventId={event._id}
                                                organizerId={event.organizerId}
                                                title={event.eventName}
                                                description={event.description}
                                                tags={[
                                                    { name: event.category || 'general', type: 'skill' },
                                                    { name: `${event.volunteersNeeded - (event.registrations || []).filter(r => r.status === 'approved').length} spots left`, type: 'spots' }
                                                ]}
                                                date={`${new Date(event.startdate).toLocaleDateString('en-GB')} - ${new Date(event.enddate).toLocaleDateString('en-GB')}`}
                                                time={`${new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })} - ${new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}`}
                                                location={event.location}
                                                requirements={event.requirements || 'No specific requirements'}
                                                onRegister={handleEventRegistered}
                                            />
                                        ))}

                                        {filteredEvents.length === 0 && (
                                            <div style={{
                                                gridColumn: '1 / -1',
                                                textAlign: 'center',
                                                padding: '3rem',
                                                color: '#6b7280'
                                            }}>
                                                <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem', margin: 0 }}>
                                                    No events found
                                                </p>
                                                <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                                                    Try adjusting your search or filter criteria
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            <CopilotPanel />
        </>
    );
};

export default VolunteerDashboard;