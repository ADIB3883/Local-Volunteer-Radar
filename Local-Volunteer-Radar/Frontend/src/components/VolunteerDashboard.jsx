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

const VolunteerNotifications = ({ onNotificationRead }) => {
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    React.useEffect(() => {
        fetchNotificationsAndAnnouncements();
    }, []);

    const fetchNotificationsAndAnnouncements = async () => {
        try {
            setLoading(true);

            // Fetch regular notifications
            const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
            const myNotifications = stored.filter(n => n.volunteerId === loggedInUser?.email);
            const sorted = myNotifications.sort((a, b) => parseInt(b.id.split('-')[0]) - parseInt(a.id.split('-')[0]));
            setNotifications(sorted);
            setUnreadCount(sorted.filter(n => !n.read).length);

            // Fetch announcements from approved events
            if (loggedInUser && loggedInUser.id) {
                const registrationsResponse = await fetch(
                    `http://localhost:5000/api/events/volunteer/${loggedInUser.id}/registrations`
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
            }
        } catch (error) {
            console.error('Error fetching notifications and announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = (notifId) => {
        const all = JSON.parse(localStorage.getItem("notifications") || "[]");
        const updated = all.map(n => n.id === notifId ? { ...n, read: true } : n);
        localStorage.setItem("notifications", JSON.stringify(updated));

        setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        if (onNotificationRead) onNotificationRead();
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', background: '#14b8a6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                </div>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Notifications & Announcements</h2>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''} • {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Announcements Section */}
            {announcements.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <svg width="20" height="20" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M16.9992 2.00312V5.26212C17.3932 5.26212 17.7833 5.33972 18.1472 5.49049C18.5112 5.64125 18.8419 5.86223 19.1205 6.1408C19.3991 6.41938 19.6201 6.7501 19.7708 7.11407C19.9216 7.47805 19.9992 7.86816 19.9992 8.26213C19.9992 8.65609 19.9216 9.0462 19.7708 9.41018C19.6201 9.77415 19.3991 10.1049 19.1205 10.3834C18.8419 10.662 18.5112 10.883 18.1472 11.0338C17.7833 11.1845 17.3932 11.2621 16.9992 11.2621V14.2621C16.9992 15.9101 15.1182 16.8511 13.7992 15.8621L11.7392 14.3161C10.638 13.4906 9.35593 12.9393 7.9992 12.7081V15.5521C7.99931 16.2059 7.76309 16.8376 7.3341 17.3309C6.9051 17.8242 6.31225 18.1458 5.66481 18.2364C5.01738 18.327 4.35902 18.1805 3.81108 17.824C3.26314 17.4674 2.86257 16.9248 2.6832 16.2961L1.1132 10.8001C0.548217 10.1329 0.180535 9.32134 0.0514852 8.45663C-0.0775649 7.59193 0.0371319 6.70836 0.382683 5.90526C0.728234 5.10216 1.29094 4.41137 2.00755 3.91052C2.72416 3.40968 3.56626 3.11864 4.4392 3.07012L7.4572 2.90212C8.93384 2.8201 10.3699 2.3886 11.6472 1.64312L13.9912 0.275125C15.3252 -0.501875 16.9992 0.459125 16.9992 2.00312ZM3.6332 12.3401L4.6062 15.7471C4.65302 15.912 4.75794 16.0544 4.90157 16.148C5.0452 16.2416 5.21785 16.2801 5.38763 16.2563C5.55741 16.2326 5.71286 16.1482 5.82527 16.0187C5.93768 15.8893 5.99946 15.7236 5.9992 15.5521V12.5421L4.4392 12.4551C4.16785 12.4388 3.89829 12.4003 3.6332 12.3401ZM14.9992 2.00312L12.6542 3.37212C11.2301 4.20384 9.64129 4.71377 7.9992 4.86612V10.6851C9.7862 10.9311 11.4872 11.6281 12.9392 12.7161L14.9992 14.2621V2.00312ZM5.9992 4.98612L4.5492 5.06612C3.87464 5.10337 3.23856 5.39215 2.76651 5.87545C2.29446 6.35875 2.02075 7.00145 1.9994 7.6767C1.97805 8.35194 2.21062 9.01065 2.6512 9.52281C3.09177 10.035 3.70834 10.3633 4.3792 10.4431L4.5492 10.4581L5.9992 10.5381V4.98612ZM16.9992 7.26212V9.26213C17.2541 9.26184 17.4992 9.16425 17.6846 8.98928C17.8699 8.81431 17.9814 8.57517 17.9964 8.32073C18.0113 8.06629 17.9285 7.81575 17.7649 7.62029C17.6013 7.42484 17.3693 7.29923 17.1162 7.26912L16.9992 7.26212Z" fill="#3b82f6"/>
                        </svg>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            Event Announcements
                        </h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {announcements.map((announcement, index) => (
                            <div
                                key={announcement._id || index}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #bfdbfe',
                                    background: 'linear-gradient(to right, #eff6ff, #f0f9ff)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: '600', color: '#111827' }}>{announcement.title}</span>
                                        <span style={{ fontSize: '0.75rem', background: '#3b82f6', color: 'white', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                                            {announcement.eventName}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{formatDate(announcement.sentAt)}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#374151', margin: 0 }}>{announcement.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Status Change Notifications Section */}
            {notifications.length > 0 && (
                <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: '0 0 1rem 0' }}>
                        Registration Updates
                    </h3>
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
                </div>
            )}

            {notifications.length === 0 && announcements.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', textAlign: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>No notifications or announcements yet</p>
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
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));


    const fetchUnreadCount = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/unread-count/${loggedInUser.email}`);
            const data = await response.json();
            setUnreadMessagesCount(data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    // Socket connection and unread messages count
    React.useEffect(() => {
        if (loggedInUser) {
            socket.emit('join', loggedInUser.email);
            fetchUnreadCount();

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
        navigate('/login');
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



    // Load events from backend API on mount
    React.useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                // Fetch approved events from backend
                const response = await fetch('http://localhost:5000/api/events');

                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }

                const events = await response.json();

                // Filter for approved events only (isApproved: true) and active status
                const approvedEvents = events.filter(event =>
                    event.isApproved === true && event.status === 'active'
                );

                // Set all events
                setAllEvents(approvedEvents);

                // Set recommended events (first 2)
                setRecommendedEvents(approvedEvents.slice(0, 2));

                // Set initial filtered events
                setFilteredEvents(approvedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                alert('Failed to load events. Please try refreshing the page.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
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

    // Function to refresh events after registration
    const refreshEvents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/events');
            if (response.ok) {
                const events = await response.json();
                const approvedEvents = events.filter(event =>
                    event.isApproved === true && event.status === 'active'
                );
                setAllEvents(approvedEvents);
                setRecommendedEvents(approvedEvents.slice(0, 2));
                setFilteredEvents(approvedEvents);
            }
        } catch (error) {
            console.error('Error refreshing events:', error);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)' }}>
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

                        <MyRegistrations />
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <VolunteerNotifications
                        onNotificationRead={() => {
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
                                            key={event._id}
                                            eventId={event._id}
                                            organizerId={event.organizerId}
                                            title={event.eventName}
                                            description={event.description}
                                            tags={[
                                                { name: event.category || 'general', type: 'skill' },
                                                { name: `${event.volunteersNeeded - event.volunteersRegistered || 0} spots left`, type: 'spots' }
                                            ]}
                                            date={`${new Date(event.startdate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })} - ${new Date(event.enddate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}`}
                                            time={`${event.startTime} - ${event.endTime}`}
                                            location={event.location}

                                            requirements={event.requirements || 'No specific requirements'}
                                            onRegister={refreshEvents}
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
                                                <option>education</option>
                                                <option>environment</option>
                                                <option>health</option>
                                                <option>community</option>
                                                <option>distribution</option>
                                                <option>other</option>
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
                                            key={event._id}
                                            eventId={event._id}
                                            organizerId={event.organizerId}
                                            title={event.eventName}
                                            description={event.description}
                                            tags={[
                                                { name: event.category || 'general', type: 'skill' },
                                                { name: `${event.volunteersNeeded - event.volunteersRegistered || 0} spots left`, type: 'spots' }
                                            ]}
                                            date={`${new Date(event.startdate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })} - ${new Date(event.enddate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}`}
                                            time={`${event.startTime} - ${event.endTime}`}
                                            location={event.location}

                                            requirements={event.requirements || 'No specific requirements'}
                                            onRegister={refreshEvents}
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
    );
};

export default VolunteerDashboard;
