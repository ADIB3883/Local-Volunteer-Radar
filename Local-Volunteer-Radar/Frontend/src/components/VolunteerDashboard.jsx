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
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Custom Toast Notification Component
const Toast = ({ message, type = 'info', onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    return (
        <div style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            background: bgColors[type],
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            minWidth: '300px',
            maxWidth: '500px',
            zIndex: 9999,
            animation: 'slideInRight 0.3s ease-out'
        }}>
            <style>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
            <div style={{
                width: '1.5rem',
                height: '1.5rem',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 'bold'
            }}>
                {icons[type]}
            </div>
            <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: '500' }}>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    padding: '0',
                    width: '1.5rem',
                    height: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '0.25rem',
                    transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
                ×
            </button>
        </div>
    );
};

const VolunteerNotifications = ({ onNotificationRead, showToast }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    React.useEffect(() => {
        console.log("Component mounted");
        console.log("loggedInUser:", loggedInUser);

        if (!loggedInUser) {
            console.log("No logged in user found");
            return;
        }

        const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
        console.log("Stored notifications:", stored);
        const myNotifications = stored.filter(n => n.volunteerId === loggedInUser?.email);
        console.log("My notifications:", myNotifications);
        const sorted = myNotifications.sort((a, b) => parseInt(b.id.split('-')[0]) - parseInt(a.id.split('-')[0]));
        setNotifications(sorted);
        setUnreadCount(sorted.filter(n => !n.read).length);
    }, []);

    const markAsRead = (notifId) => {
        const all = JSON.parse(localStorage.getItem("notifications") || "[]");
        const updated = all.map(n => n.id === notifId ? { ...n, read: true } : n);
        localStorage.setItem("notifications", JSON.stringify(updated));

        setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        if (onNotificationRead) onNotificationRead();

        // Show toast notification
        if (showToast) {
            showToast('Notification marked as read', 'success');
        }
    };

    return (
        <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', background: '#14b8a6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                </div>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Notifications</h2>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {notifications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => !notif.read && markAsRead(notif.id)}
                            style={{
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                border: notif.read ? '1px solid #e5e7eb' : '2px solid #3b82f6',
                                background: notif.read ? '#f9fafb' : '#eff6ff',
                                cursor: notif.read ? 'default' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontWeight: '600', color: '#111827' }}>{notif.title}</span>
                                    {!notif.read && <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }}></span>}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{notif.timestamp}</span>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#374151', margin: '0 0 0.5rem 0' }}>{notif.message}</p>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                <span>📍 {notif.eventName}</span>
                                <span style={{ margin: '0 0.5rem' }}>•</span>
                                <span>{notif.organizationName}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', textAlign: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>No notifications yet</p>
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
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [toast, setToast] = useState(null);

    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // Toast notification function
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const fetchUnreadCount = async () => {
        // Only fetch if user is logged in
        if (!loggedInUser || !loggedInUser.email) {
            console.log('No logged in user, skipping unread count fetch');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/unread-count/${loggedInUser.email}`);

            if (!response.ok) {
                console.error('Failed to fetch unread count, status:', response.status);
                return;
            }

            const data = await response.json();
            setUnreadMessagesCount(data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
            // Only show toast in development or if explicitly needed
            // showToast('Failed to fetch unread message count', 'error');
        }
    };

    // Socket connection and unread messages count
    React.useEffect(() => {
        if (loggedInUser && loggedInUser.email) {
            // Join socket room
            socket.emit('join', loggedInUser.email);

            // Fetch initial unread count
            fetchUnreadCount();

            // Listen for unread count updates
            socket.on('unread_count_update', (data) => {
                setUnreadMessagesCount(data.count);
            });

            return () => {
                socket.off('unread_count_update');
            };
        }
    }, [loggedInUser]);


    // Listen for openChat event from EventCard
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
        if(!loggedInUser || userType !== "volunteer"){
            navigate("/login");
        }

        const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
        const myNotifications = stored.filter(n => n.volunteerId === loggedInUser?.email);
        const unreadCount = myNotifications.filter(n => !n.read).length;
        setUnreadNotificationsCount(unreadCount);
    }, [activeTab]);


    const handleProfileClick = () => {
        navigate('/volunteer-profile');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem("loggedInUser");
        showToast('Logged out successfully', 'success');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const stats = [
        {
            id: 'events',
            title: 'Events Completed',
            value: '12',
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
            value: '40',
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
            value: '0',
            subtitle: 'Upcoming events',
            icon: Calendar,
            iconColor: '#06b6d4',
            iconBg: '#cffafe',
            modalTitle: 'Active Registrations',
            modalContent: <ActiveRegistrationModal />
        },
        {
            id: 'skills',
            title: 'Skills Utilized',
            value: '2',
            subtitle: 'Active skill categories',
            icon: TrendingUp,
            iconColor: '#a855f7',
            iconBg: '#f3e8ff',
            modalTitle: 'Skills Utilized',
            modalContent: <SkillsUtilizedModal />
        }
    ];

    // Load events from localStorage on mount
    React.useEffect(() => {
        const stored = localStorage.getItem('events');
        if (stored) {
            const parsedEvents = JSON.parse(stored);

            // Filter for active events only
            const activeEvents = parsedEvents.filter(event => event.status === 'pending');

            // Set all events
            setAllEvents(activeEvents);

            // Set recommended events (first 2)
            setRecommendedEvents(activeEvents.slice(0, 2));

            // Set initial filtered events
            setFilteredEvents(activeEvents);
        }
    }, []);

    // Filter function
    const handleFilter = () => {
        let filtered = [...allEvents];

        // Filter by search query
        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(event =>
                event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (event.requirements && event.requirements.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Filter by category
        if (selectedCategory !== 'All Category') {
            filtered = filtered.filter(event => {
                return event.category?.toLowerCase() === selectedCategory.toLowerCase() ||
                    (event.requirements && event.requirements.toLowerCase().includes(selectedCategory.toLowerCase()));
            });
        }

        setFilteredEvents(filtered);
    };

    // Call filter when search or category changes
    React.useEffect(() => {
        handleFilter();
    }, [searchQuery, selectedCategory, allEvents]);

    const refreshEvents = () => {
        const stored = localStorage.getItem('events');
        if (stored) {
            const parsedEvents = JSON.parse(stored);
            const activeEvents = parsedEvents.filter(event => event.status === 'pending');
            setAllEvents(activeEvents);
            setRecommendedEvents(activeEvents.slice(0, 2));
            setFilteredEvents(activeEvents);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)' }}>
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

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
                        onClick={() => setActiveTab('notifications')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.75rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            background: activeTab === 'notifications' ? 'white' : 'transparent',
                            color: activeTab === 'notifications' ? '#111827' : '#4b5563',
                            boxShadow: activeTab === 'notifications' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                            position: 'relative'
                        }}
                        onMouseOver={(e) => { if (activeTab !== 'notifications') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)' }}
                        onMouseOut={(e) => { if (activeTab !== 'notifications') e.currentTarget.style.background = 'transparent' }}
                    >
                        Notifications
                        {unreadNotificationsCount > 0 && (
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
                                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
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

                        <MyRegistrations showToast={showToast} />
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <VolunteerNotifications
                        showToast={showToast}
                        onNotificationRead={() => {
                            // Refresh unread count
                            const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
                            const myNotifications = stored.filter(n => n.volunteerId === loggedInUser?.email);
                            const unreadCount = myNotifications.filter(n => !n.read).length;
                            setUnreadNotificationsCount(unreadCount);
                        }}
                    />
                )}
                {activeTab === 'messages' && (
                    <MessagesTab currentUser={loggedInUser} />
                )}
                {/* Show events only on Discover tab */}
                {activeTab === 'discover' && (
                    <>

                        {/* Recommended Section */}
                        <div style={{ background: 'linear-gradient(to right, #eff6ff, #eef2ff)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #dbeafe', boxShadow: '0 10px 20px -3px rgba(0, 0, 0, 0.15)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Sparkles size={20} style={{ color: '#3b82f6' }} />
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Recommended For You</h2>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>Events matching your skills and location</p>
                        </div>

                        {/* Event Cards - Recommended */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem', maxWidth: '100%' }}>
                            {recommendedEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    eventId={event.id}
                                    organizerId={event.organizerId}
                                    title={event.eventName}
                                    description={event.description}
                                    tags={[
                                        { name: event.category || 'general', type: 'skill' },
                                        { name: `${event.volunteersNeeded - event.volunteersRegistered || 0} spots left`, type: 'spots' }
                                    ]}
                                    date={new Date(event.startdate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    time={`${event.startTime} - ${event.endTime}`}
                                    location={event.location}
                                    distance="Calculating..."
                                    requirements={event.requirements || 'No specific requirements'}
                                    showToast={showToast}
                                    onRegister={() => {
                                        refreshEvents();
                                    }}
                                />
                            ))}
                        </div>

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
                                        <option>First-Aid</option>
                                        <option>Distribution</option>
                                        <option>Education</option>
                                        <option>Environment</option>
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

                        {/* Event Cards - All Events */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '100%' }}>
                            {filteredEvents.map((event) => (

                                <EventCard
                                    key={event.id}
                                    eventId={event.id}
                                    organizerId={event.organizerId}
                                    title={event.eventName}
                                    description={event.description}
                                    tags={[
                                        { name: event.category || 'general', type: 'skill' },
                                        { name: `${event.volunteersNeeded - event.volunteersRegistered || 0} spots left`, type: 'spots' }
                                    ]}
                                    date={new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    time={`${event.startTime} - ${event.endTime}`}
                                    location={event.location}
                                    distance="Calculating..."
                                    requirements={event.requirements || 'No specific requirements'}
                                    showToast={showToast}
                                    onRegister={() => {
                                        refreshEvents();
                                    }}
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
            </div>
        </div>
    );
};

export default VolunteerDashboard;
