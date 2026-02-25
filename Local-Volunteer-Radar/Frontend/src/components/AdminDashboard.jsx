import React, {useEffect, useMemo, useState} from 'react';
import './AdminStyles.css';
import { useNavigate } from 'react-router-dom';
import { Users, Building, Search, ChevronDown, X, Sparkles, Loader2Icon, Phone, MapPin, Calendar, Tag, Briefcase, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import StatCard from './StatCard.jsx';
import AdminNavbar from "./AdminNavbar.jsx";
import AdminAnalytics from "./AdminAnalytics.jsx";
import PendingUserCard from './PendingUserCard.jsx';
import PendingEventsCard from "./PendingEventsCard.jsx";
import Modal from './Modal';
import TotalVolunteerModal from './TotalVolunteerModal';
import TotalOrganizerModal from './TotalOrganizerModal';
import ActiveEventsModal from './ActiveEventsModal';
import PartnerModal from './PartnerModal.jsx';
import LogoutPopup from './LogoutPopup.jsx';

// Loading spinner component
const LoadingSpinner = ({ message = "Loading..." }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        color: '#6b7280'
    }}>
        <Loader2 size={32} className="animate-spin mb-4" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ margin: 0, fontSize: '1rem', fontWeight: '500' }}>{message}</p>
    </div>
);

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('partner');
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [modalOpen, setModalOpen] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loadingPending, setLoadingPending] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationConfig, setNotificationConfig] = useState({
        borderColor: '',
        bgColor: '',
        message: ''
    });
    const [users, setUsers] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [pendingSearchQuery, setPendingSearchQuery] = useState('');
    const [pendingTypeFilter, setPendingTypeFilter] = useState('');
    const [pendingSortBy, setPendingSortBy] = useState('');
    const [eventSearchQuery, setEventSearchQuery] = useState('');
    const [eventSortBy, setEventSortBy] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, userId: null, userName: '' });
    const [isDeleting, setIsDeleting] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const fetchUsers = async (endpoint, setter) => {
        try {
            const res = await fetch(`https://local-volunteer-radar.onrender.com/api${endpoint}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setter(data.data || data.users || []);
        } catch (err) {
            console.error(err);
            setter([]);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetchUsers('/users', setUsers),
            // Use our stricter fetch to ensure only explicit isPending === true
            fetchPendingUsers()
        ]).finally(() => setLoading(false));
    }, []);

    // Simplified refetch
    const refetchUsers = () => {
        fetchUsers('/users', setUsers);
        fetchUsers('/users/pending', setPendingUsers);
    };

    useEffect(() => {
        fetch("https://local-volunteer-radar.onrender.com/api/admin/analytics")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched analytics:", data);
                setAnalytics(data);
            })
            .catch((err) => {
                console.error("Error fetching analytics:", err);
            });
    }, []);

    useEffect(() => {
        const fetchPendingEvents = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://local-volunteer-radar.onrender.com/api/admin/events/admin-pending");
                const data = await res.json();
                setPendingEvents(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch pending events:", err);
                setPendingEvents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingEvents();
    }, []);

    const refetchPendingEvents = async () => {
        try {
            const res = await fetch("https://local-volunteer-radar.onrender.com/api/admin/events/admin-pending");
            const data = await res.json();
            
            // Ensure we only have unapproved events
            const validPendingEvents = Array.isArray(data) 
                ? data.filter(event => event.isApproved === false)
                : [];
            
            console.log(`Refetched ${validPendingEvents.length} pending events`);
            setPendingEvents(validPendingEvents);
        } catch (err) {
            console.error("Failed to fetch pending events:", err);
        }
    };

    // Helper to safely extract date from schema format
    const getCreatedAtDate = (createdAt) => {
        if (!createdAt) return new Date(0);
        if (createdAt.$date) return new Date(createdAt.$date);
        return new Date(createdAt);
    };

    // Helper for consistent field access
    const getUserDisplayName = (user) => user.name || '';
    const getUserType = (user) => user.type?.toLowerCase() || '';

    const formatDate = (createdAt) => {
        if (!createdAt) return 'Unknown';
        const date = createdAt.$date ? new Date(createdAt.$date) : new Date(createdAt);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getSkillsDisplay = (skills) => {
        if (Array.isArray(skills)) return skills;
        if (typeof skills === 'object') {
            return Object.keys(skills).filter(key => skills[key]);
        }
        return [];
    };

    const getInitials = (name) => name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'UN';
    const getAvatarColor = (name) => {
        const colors = ['#f97316', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };


    const filteredAndSortedUsers = useMemo(() => {
        const baseUsers = Array.isArray(users) ? [...users] : [];

        return baseUsers
            .filter(user => {
                // Search filter
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    const name = getUserDisplayName(user).toLowerCase();
                    const email = user.email?.toLowerCase() || '';
                    return name.includes(query) || email.includes(query);
                }
                return true;
            })
            .filter(user => {
                // Type filter
                if (selectedType) {
                    return getUserType(user) === selectedType.toLowerCase();
                }
                return true;
            })
            .sort((a, b) => {
                // Sort logic
                if (!sortBy) return 0;

                switch (sortBy) {
                    case 'name-asc':
                        return getUserDisplayName(a).localeCompare(getUserDisplayName(b));
                    case 'name-desc':
                        return getUserDisplayName(b).localeCompare(getUserDisplayName(a));
                    case 'date-asc':
                        return getCreatedAtDate(a.createdAt) - getCreatedAtDate(b.createdAt);
                    case 'date-desc':
                        return getCreatedAtDate(b.createdAt) - getCreatedAtDate(a.createdAt);
                    case 'email-asc':
                        return (a.email || '').localeCompare(b.email || '');
                    case 'email-desc':
                        return (b.email || '').localeCompare(a.email || '');
                    default:
                        return 0;
                }
            });
    }, [users, searchQuery, selectedType, sortBy]);

    const filteredAndSortedPendingUsers = useMemo(() => {
        const base = Array.isArray(pendingUsers) ? [...pendingUsers] : [];

        // Strict: only explicit isPending true
        let filtered = base.filter(u => u.isPending === true);

        // Search
        if (pendingSearchQuery) {
            const q = pendingSearchQuery.toLowerCase();
            filtered = filtered.filter(user => [
                getUserDisplayName(user) || '',
                user.email || '',
                user.phoneNumber || user.phone || '',
                user.address || ''
            ].some(field => field.toLowerCase().includes(q)));
        }

        // Type filter
        if (pendingTypeFilter) {
            filtered = filtered.filter(user => getUserType(user) === pendingTypeFilter.toLowerCase());
        }

        // Sort
        if (pendingSortBy) {
            filtered.sort((a, b) => {
                switch (pendingSortBy) {
                    case 'name-asc':
                        return getUserDisplayName(a).localeCompare(getUserDisplayName(b));
                    case 'name-desc':
                        return getUserDisplayName(b).localeCompare(getUserDisplayName(a));
                    case 'date-asc':
                        return getCreatedAtDate(a.createdAt) - getCreatedAtDate(b.createdAt);
                    case 'date-desc':
                        return getCreatedAtDate(b.createdAt) - getCreatedAtDate(a.createdAt);
                    case 'email-asc':
                        return (a.email || '').localeCompare(b.email || '');
                    case 'email-desc':
                        return (b.email || '').localeCompare(a.email || '');
                    default:
                        return 0;
                }
            });
        }

        return filtered;
    }, [pendingUsers, pendingSearchQuery, pendingTypeFilter, pendingSortBy]);
    const filteredAndSortedPendingEvents = useMemo(() => {
        let filtered = Array.isArray(pendingEvents)
            ? pendingEvents
            : [];

        // Strict filter: ONLY show events where isApproved === false
        filtered = filtered.filter(event => {
            return event.isApproved === false;
        });

        if (eventSearchQuery) {
            const query = eventSearchQuery.toLowerCase();
            filtered = filtered.filter(event =>
                event.eventName?.toLowerCase().includes(query) ||
                event.description?.toLowerCase().includes(query) ||
                event.location?.toLowerCase().includes(query)
            );
        }

        if (eventSortBy) {
            filtered.sort((a, b) => {
                switch (eventSortBy) {
                    case 'title-asc':
                        return (a.eventName || '').localeCompare(b.eventName || '');
                    case 'title-desc':
                        return (b.eventName || '').localeCompare(a.eventName || '');
                    case 'date-asc':
                        return new Date(`${a.startdate || ''}T${a.startTime || ''}`) - new Date(`${b.startdate || ''}T${b.startTime || ''}`);
                    case 'date-desc':
                        return new Date(`${b.startdate || ''}T${b.startTime || ''}`) - new Date(`${a.startdate || ''}T${a.startTime || ''}`);
                    case 'submitted-asc':
                        const aDate = a.createdAt?.$date || a.createdAt || 0;
                        const bDate = b.createdAt?.$date || b.createdAt || 0;
                        return new Date(aDate) - new Date(bDate);
                    case 'submitted-desc':
                        const aDateDesc = a.createdAt?.$date || a.createdAt || 0;
                        const bDateDesc = b.createdAt?.$date || b.createdAt || 0;
                        return new Date(bDateDesc) - new Date(aDateDesc);
                    default:
                        return 0;
                }
            });
        }

        return filtered;
    }, [pendingEvents, eventSearchQuery, eventSortBy]);

    const navigate = useNavigate();

    const [selectedStat, setSelectedStat] = useState(null);
    const [activeEvents, setActiveEvents] = useState([]);

    // Fetch active events
    useEffect(() => {
        const fetchActiveEvents = async () => {
            try {
                const res = await fetch('https://local-volunteer-radar.onrender.com/api/events/active');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setActiveEvents(Array.isArray(data) ? data : data.events || []);
            } catch (err) {
                console.error('Error fetching active events:', err);
                setActiveEvents([]);
            }
        };
        fetchActiveEvents();
    }, []);

    // Fetch pending users when the tab changes to pendingRegistrations
    useEffect(() => {
        if (activeTab === 'pendingRegistrations') {
            fetchPendingUsers();
        }
    }, [activeTab]);

    const fetchPendingUsers = async () => {
        setLoadingPending(true);
        try {
            const res = await fetch('https://local-volunteer-radar.onrender.com/api/users/pending');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            // Ensure we only store users with explicit isPending === true
            const raw = data.data || data.pendingUsers || [];
            const onlyPending = Array.isArray(raw) ? raw.filter(u => u.isPending === true) : [];
            setPendingUsers(onlyPending);
        } catch (err) {
            console.error('Error fetching pending users:', err);
            setPendingUsers([]);
        } finally {
            setLoadingPending(false);
        }
    };

    // Handler for user approval
    const handleUserApprove = (userId, userName) => {
        setPendingUsers(prev => prev.filter(user => {
            const oid = user._id?.$oid || user._id || user.id || '';
            return String(oid) !== String(userId);
        }));
        setNotificationConfig({
            borderColor: 'border-green-500',
            bgColor: 'bg-green-500',
            message: `${userName} approved successfully!`
        });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    // Handler for user rejection
    const handleUserReject = (userId, userName) => {
        setPendingUsers(prev => prev.filter(user => {
            const oid = user._id?.$oid || user._id || user.id || '';
            return String(oid) !== String(userId);
        }));
        setNotificationConfig({
            borderColor: 'border-red-500',
            bgColor: 'bg-red-500',
            message: `${userName} rejected successfully!`
        });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };
    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
        setTimeout(() => {
            setShowLogoutPopup(false);
            navigate('/login');
        }, 1500);
    };

    const handleDeleteUser = async (userId) => {
        try {
            if (!selectedUser) {
                throw new Error('No user selected');
            }

            const userType = (selectedUser.type || 'volunteer').toLowerCase();

            if (userType !== 'volunteer' && userType !== 'organizer') {
                throw new Error(`Invalid user type: ${userType}`);
            }

            const res = await fetch(`https://local-volunteer-radar.onrender.com/api/users/reject/${userType}/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
            }

            setUsers(prev => prev.filter(u => (u._id?.$oid || u._id) !== userId));
            setSelectedUser(null);
            setDeleteConfirm({ show: false, userId: null, userName: '' });
            setIsDeleting(false); // ✅ Reset state

            setNotificationConfig({
                borderColor: 'border-green-500',
                bgColor: 'bg-green-500',
                message: 'User deleted successfully!'
            });
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        } catch (err) {
            console.error('Delete error:', err);
            setIsDeleting(false); //
            setNotificationConfig({
                borderColor: 'border-red-500',
                bgColor: 'bg-red-500',
                message: err.message || 'Failed to delete user'
            });
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        }
    };


    const initiateDelete = (userId, userName) => {
        setDeleteConfirm({ show: true, userId, userName });
    };

    const totalVolunteers = useMemo(
        () => users?.filter(u => u.type === 'volunteer').length || 0,
        [users]
    );

    const totalOrganizers = useMemo(
        () => users?.filter(u => u.type === 'organizer').length || 0,
        [users]
    );

    // Format volunteer data for modal
    const volunteerData = useMemo(() => {
        return (users || []).filter(u => u.type === 'volunteer').map(v => ({
            id: v._id?.$oid || v._id || v.id,
            name: v.name || 'Unknown',
            email: v.email || '',
            location: v.address || v.location || 'Unknown',
            joinedDate: formatDate(v.createdAt || v.joinedDate),
            eventsCompleted: 0,
            hoursContributed: 0,
            skills: getSkillsDisplay(v.skills) || [],
            profilePicture: v.profilePicture || ''
        }));
    }, [users]);

    // Format organizer data for modal
    const organizerData = useMemo(() => {
        return (users || []).filter(u => u.type === 'organizer').map(o => ({
            id: o._id?.$oid || o._id || o.id,
            name: o.name || 'Unknown',
            email: o.email || '',
            location: o.address || o.location || 'Unknown',
            joinedDate: formatDate(o.createdAt || o.joinedDate),
            eventsCreated: 0,
            totalVolunteers: 0,
            category: o.category || 'General',
            status: o.isVerified ? 'verified' : 'pending',
            profilePicture: o.profilePicture || ''
        }));
    }, [users]);

    // Format active events data for modal
    const formattedActiveEvents = useMemo(() => {
        return (activeEvents || []).map(e => ({
            id: e._id?.$oid || e._id || e.id,
            name: e.eventName || 'Unknown',
            organization: e.organizerId?.name || e.organizerName || 'Unknown',
            date: e.startdate || 'Unknown',
            time: `${e.startTime || '00:00'} - ${e.endTime || '00:00'}`,
            location: e.location || 'Unknown',
            category: e.category || 'General',
            volunteersRegistered: e.volunteersRegistered || 0,
            volunteersNeeded: e.volunteersNeeded || 0,
            status: 'active',
            registrations: e.registrations || []  // Add registrations field
        }));
    }, [activeEvents]);

    const stats = useMemo(() => [
        {
            id: 'volunteers',
            title: 'Total Volunteers',
            value: totalVolunteers,
            subtitle: 'Volunteers across the country',
            icon: Users,
            iconColor: '#3b82f6',
            iconBg: '#dbeafe',
            modalTitle: 'Total Volunteers',
            modalContent: <TotalVolunteerModal volunteers={volunteerData} />
        },
        {
            id: 'organizers',
            title: 'Total Organizers',
            value: totalOrganizers,
            subtitle: 'Organizers registered',
            icon: Building,
            iconColor: '#06b6d4',
            iconBg: '#cffafe',
            modalTitle: 'Total Organizers',
            modalContent: <TotalOrganizerModal organizers={organizerData} />
        },
        {
            id: 'events',
            title: 'Active Events',
            value: activeEvents.length,
            subtitle: 'Events taking place',
            icon: Sparkles,
            iconColor: '#a855f7',
            iconBg: '#f3e8ff',
            modalTitle: 'Ongoing Events',
            modalContent: <ActiveEventsModal events={formattedActiveEvents} />
        }
    ], [totalVolunteers, totalOrganizers, activeEvents.length, volunteerData, organizerData, formattedActiveEvents]);

    const closeModal = () => {
        setSelectedUser(null);
    };

    return (
        <div className="admin-no-select" style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)' }}>
            {/* Navbar */}
            <AdminNavbar
                title="Admin Dashboard"
                onLogoutClick={handleLogoutClick}
            />
            <LogoutPopup showLogout={showLogoutPopup} />
            {showNotification && (
                <div
                    className={`fixed top-6 left-6 bg-white rounded-lg shadow-2xl p-4 flex items-center gap-3 border-l-4 ${notificationConfig.borderColor} transform transition-all duration-500 z-50 ${
                        showNotification ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                    }`}
                >
                    <div className={`w-10 h-10 ${notificationConfig.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-3xl font-bold leading-none">!</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{notificationConfig.message}</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {stats.map((stat) => (
                        <StatCard
                            key={stat.id}
                            onClick={() => setModalOpen(stat.id)}
                            title={stat.title}
                            value={stat.value}
                            subtitle={stat.subtitle}
                            icon={stat.icon}
                            iconColor={stat.iconColor}
                            iconBg={stat.iconBg}
                        />
                    ))}
                </div>

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
                <div style={{
                    display: 'inline-flex',
                    gap: '0',
                    marginBottom: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    padding: '0.25rem',
                    borderRadius: '0.875rem',
                    border: '1px solid rgba(255, 255, 255, 0.4)'
                }}>
                    <button
                        onClick={() => setActiveTab('partner')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.625rem',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: activeTab === 'partner' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                            color: activeTab === 'partner' ? '#111827' : '#4b5563',
                            boxShadow: activeTab === 'partner' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'partner') {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                e.currentTarget.style.color = '#374151';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'partner') {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#4b5563';
                            }
                        }}
                    >
                        Partners
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.625rem',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: activeTab === 'analytics' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                            color: activeTab === 'analytics' ? '#111827' : '#4b5563',
                            boxShadow: activeTab === 'analytics' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'analytics') {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                e.currentTarget.style.color = '#374151';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'analytics') {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#4b5563';
                            }
                        }}
                    >
                        Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('pendingRegistrations')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.625rem',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: activeTab === 'pendingRegistrations' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                            color: activeTab === 'pendingRegistrations' ? '#111827' : '#4b5563',
                            boxShadow: activeTab === 'pendingRegistrations' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'pendingRegistrations') {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                e.currentTarget.style.color = '#374151';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'pendingRegistrations') {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#4b5563';
                            }
                        }}
                    >
                        Pending Registrations
                    </button>
                    <button
                        onClick={() => setActiveTab('pendingEvents')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.625rem',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: activeTab === 'pendingEvents' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                            color: activeTab === 'pendingEvents' ? '#111827' : '#4b5563',
                            boxShadow: activeTab === 'pendingEvents' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Pending Events
                    </button>
                </div>

                {activeTab === 'analytics' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        {analytics ? (
                            <AdminAnalytics analytics={analytics} />
                        ) : (
                            <LoadingSpinner message="Loading analytics..." />
                        )}
                    </div>
                )}

                {activeTab === 'partner' && (
                    <>
                        {/* Search and Filter Section */}
                        <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '1.25rem', padding: '1.25rem', border: '1px solid rgba(0, 0, 0, 0.06)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93' }} size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search A Partner..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem 0.625rem 2.75rem',
                                            border: 'none',
                                            borderRadius: '0.625rem',
                                            fontSize: '0.9375rem',
                                            fontWeight: '400',
                                            background: 'rgba(142, 142, 147, 0.12)',
                                            color: '#000',
                                            outline: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    />
                                </div>

                                <div style={{ position: 'relative', width: '150px', minWidth: '150px' }}>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 2rem 0.625rem 0.875rem',
                                            border: 'none',
                                            borderRadius: '0.625rem',
                                            fontSize: '0.9375rem',
                                            fontWeight: '400',
                                            background: 'rgba(142, 142, 147, 0.12)',
                                            color: '#000',
                                            cursor: 'pointer',
                                            appearance: 'none',
                                            outline: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <option value="">All Types</option>
                                        <option value="volunteer">Volunteer</option>
                                        <option value="organizer">Organizer</option>
                                    </select>
                                    <ChevronDown style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93', pointerEvents: 'none' }} size={16} />
                                </div>

                                <div style={{ position: 'relative', width: '180px', minWidth: '180px' }}>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 2rem 0.625rem 0.875rem',
                                            border: 'none',
                                            borderRadius: '0.625rem',
                                            fontSize: '0.9375rem',
                                            fontWeight: '400',
                                            background: 'rgba(142, 142, 147, 0.12)',
                                            color: '#000',
                                            cursor: 'pointer',
                                            appearance: 'none',
                                            outline: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <option value="">Sort By</option>
                                        <option value="name-asc">Name (A-Z)</option>
                                        <option value="name-desc">Name (Z-A)</option>
                                        <option value="date-asc">Join Date (Oldest)</option>
                                        <option value="date-desc">Join Date (Newest)</option>
                                        <option value="email-asc">Email (A-Z)</option>
                                        <option value="email-desc">Email (Z-A)</option>
                                    </select>
                                    <ChevronDown style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93', pointerEvents: 'none' }} size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Partners List */}
                        <div style={{ margin: '0 auto' }}>
                            {loading ? (
                                <LoadingSpinner message="Loading partners..." />
                            ) : (
                                <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                                    {/* Table Header */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 2fr 1fr 1fr',
                                        gap: '1rem',
                                        padding: '1rem 1.5rem',
                                        borderBottom: '1px solid #f3f4f6',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: '#6b7280'
                                    }}>
                                        <div>NAME</div>
                                        <div>EMAIL</div>
                                        <div>TYPE</div>
                                        <div>JOINED</div>
                                    </div>

                                    {/* Table Rows */}
                                    {filteredAndSortedUsers
                                        .filter(user => user.type !== 'admin')
                                        .map((user) => (
                                            <div
                                                key={user._id.$oid}
                                                onClick={() => setSelectedUser(user)}
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '2fr 2fr 1fr 1fr',
                                                    gap: '1rem',
                                                    padding: '1rem 1.5rem',
                                                    alignItems: 'center',
                                                    borderBottom: '1px solid #f3f4f6',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{
                                                        width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                                                        background: user.profilePicture ? 'transparent' : getAvatarColor(user.name || 'User'),
                                                        color: 'white', fontWeight: '600', fontSize: '0.875rem',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        overflow: 'hidden',
                                                        objectFit: 'cover'
                                                    }}>
                                                        {user.profilePicture ? (
                                                            <img src={user.profilePicture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            getInitials(user.name || 'User')
                                                        )}
                                                    </div>
                                                    <span style={{ fontWeight: '500', color: '#111827' }}>
                                    {user.name || 'Unnamed'}
                                </span>
                                                </div>

                                                <div style={{ color: '#000', fontSize: '0.875rem' }}>
                                                    {user.email || 'No email'}
                                                </div>

                                                <div>
                                <span style={{
                                    padding: '0.375rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem',
                                    fontWeight: '500',
                                    background: user.type === 'volunteer' ? '#fef3c7' :
                                        user.type === 'organizer' ? '#dbeafe' : '#f3e8ff',
                                    color: user.type === 'volunteer' ? '#92400e' :
                                        user.type === 'organizer' ? '#1e40af' : '#7c2d12'
                                }}>
                                    {user.type?.toUpperCase() || 'UNKNOWN'}
                                </span>
                                                </div>

                                                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                                    {formatDate(user.createdAt)}  {/* ✅ Schema field */}
                                                </div>
                                            </div>
                                        ))}

                                    {filteredAndSortedUsers.length === 0 && (
                                        <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                                            No partners found
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Fixed Modal */}
                            <PartnerModal 
                                selectedUser={selectedUser} 
                                onClose={() => setSelectedUser(null)} 
                                initiateDelete={initiateDelete}
                                formatDate={formatDate}
                                getInitials={getInitials}
                                getAvatarColor={getAvatarColor}
                                getSkillsDisplay={getSkillsDisplay}
                            />

                            {/* Delete Confirmation Dialog */}
                            {deleteConfirm.show && (
                                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
                                    <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div style={{ background: '#fee2e2', borderRadius: '50%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <AlertCircle size={24} color="#dc2626" />
                                            </div>
                                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>Delete User?</h3>
                                        </div>
                                        <p style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '0.875rem' }}>
                                            Are you sure you want to delete <strong>{deleteConfirm.userName}</strong>? This action cannot be undone.
                                        </p>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                onClick={() => setDeleteConfirm({ show: false, userId: null, userName: '' })}
                                                style={{
                                                    flex: 1, padding: '0.75rem 1rem', border: '1px solid #d1d5db',
                                                    background: 'white', color: '#374151', borderRadius: '0.625rem',
                                                    cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsDeleting(true);
                                                    handleDeleteUser(deleteConfirm.userId);
                                                }}
                                                disabled={isDeleting}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.75rem 1rem',
                                                    background: isDeleting ? '#9ca3af' : '#dc2626',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.625rem',
                                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '0.875rem',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    opacity: isDeleting ? 0.7 : 1
                                                }}onMouseEnter={(e) => {
                                                if (!isDeleting) e.currentTarget.style.background = '#b91c1c';
                                            }}
                                                onMouseLeave={(e) => {
                                                    if (!isDeleting) e.currentTarget.style.background = '#dc2626';
                                                }}
                                            >
                                                {isDeleting ? (
                                                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    'Delete'
                                                )}
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Pending Registrations Tab */}
                {activeTab === 'pendingRegistrations' && (
                    <>
                        {/* Search and Filter Section for Pending Registrations */}
                        <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '1.25rem', padding: '1.25rem', border: '1px solid rgba(0, 0, 0, 0.06)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93' }} size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search pending registrations..."
                                        value={pendingSearchQuery}
                                        onChange={(e) => setPendingSearchQuery(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem 0.625rem 2.75rem',
                                            border: 'none',
                                            borderRadius: '0.625rem',
                                            fontSize: '0.9375rem',
                                            fontWeight: '400',
                                            background: 'rgba(142, 142, 147, 0.12)',
                                            color: '#000',
                                            outline: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    />
                                </div>

                                <div style={{ position: 'relative', width: '150px', minWidth: '150px' }}>
                                    <select
                                        value={pendingTypeFilter}
                                        onChange={(e) => setPendingTypeFilter(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 2rem 0.625rem 0.875rem',
                                            border: 'none',
                                            borderRadius: '0.625rem',
                                            fontSize: '0.9375rem',
                                            fontWeight: '400',
                                            background: 'rgba(142, 142, 147, 0.12)',
                                            color: '#000',
                                            cursor: 'pointer',
                                            appearance: 'none',
                                            outline: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <option value="">All Types</option>
                                        <option value="volunteer">Volunteer</option>
                                        <option value="organizer">Organizer</option>
                                    </select>
                                    <ChevronDown style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93', pointerEvents: 'none' }} size={16} />
                                </div>

                                <div style={{ position: 'relative', width: '180px', minWidth: '180px' }}>
                                    <select
                                        value={pendingSortBy}
                                        onChange={(e) => setPendingSortBy(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 2rem 0.625rem 0.875rem',
                                            border: 'none',
                                            borderRadius: '0.625rem',
                                            fontSize: '0.9375rem',
                                            fontWeight: '400',
                                            background: 'rgba(142, 142, 147, 0.12)',
                                            color: '#000',
                                            cursor: 'pointer',
                                            appearance: 'none',
                                            outline: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <option value="">Sort By</option>
                                        <option value="name-asc">Name (A-Z)</option>
                                        <option value="name-desc">Name (Z-A)</option>
                                        <option value="date-asc">Submitted (Oldest)</option>
                                        <option value="date-desc">Submitted (Newest)</option>
                                        <option value="email-asc">Email (A-Z)</option>
                                        <option value="email-desc">Email (Z-A)</option>
                                    </select>
                                    <ChevronDown style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93', pointerEvents: 'none' }} size={16} />
                                </div>
                            </div>
                        </div>

                        {loadingPending ? (
                            <div style={{
                                padding: '3rem',
                                textAlign: 'center',
                                color: '#6b7280',
                                fontSize: '1rem'
                            }}>
                                Loading pending registrations...
                            </div>
                        ) : filteredAndSortedPendingUsers.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 250px))',
                                columnGap: '11.5rem',
                                rowGap: '1.5rem',
                                justifyContent: 'start',
                            }}>
                                {filteredAndSortedPendingUsers.map((userData) => {
                                    const uid = userData._id?.$oid || userData._id || '';
                                    const inferredType = userData.type ? (String(userData.type).charAt(0).toUpperCase() + String(userData.type).slice(1)) : (userData.organizationType ? 'Organizer' : 'Volunteer');
                                    return (
                                        <PendingUserCard
                                            key={uid}
                                            id={uid}
                                            name={userData.name}
                                            type={inferredType}
                                            status={userData.status}
                                            phone={userData.phoneNumber || userData.phone || ''}
                                            email={userData.email}
                                            address={userData.address}
                                            joiningDate={userData.createdAt?.$date || 'N/A'}
                                            description={userData.description || userData.bio || 'N/A'}
                                            skills={userData.skills || {}}
                                            profilePicture={userData.profilePicture || ''}
                                            onApprove={handleUserApprove}
                                            onReject={handleUserReject}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{
                                padding: '3rem',
                                textAlign: 'center',
                                color: '#6b7280',
                                fontSize: '1rem'
                            }}>
                                {pendingSearchQuery || pendingTypeFilter ? 'No matching registrations found' : 'No pending registrations'}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'pendingEvents' && (
                    <>
                        {/* Search and Filter Section for Pending Events */}
                        <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '1.25rem', padding: '1.25rem', border: '1px solid rgba(0, 0, 0, 0.06)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93' }} size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search pending events..."
                                        value={eventSearchQuery}
                                        onChange={(e) => setEventSearchQuery(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 0.875rem 0.625rem 2.75rem',
                                            border: 'none',
                                            borderRadius: '0.625rem',
                                            fontSize: '0.9375rem',
                                            fontWeight: '400',
                                            background: 'rgba(142, 142, 147, 0.12)',
                                            color: '#000',
                                            outline: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    />
                                </div>

                                <div style={{ position: 'relative', width: '180px', minWidth: '180px' }}>
                                    <select
                                        value={eventSortBy}
                                        onChange={(e) => setEventSortBy(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 2rem 0.625rem 0.875rem',
                                            border: 'none',
                                            borderRadius: '0.625rem',
                                            fontSize: '0.9375rem',
                                            fontWeight: '400',
                                            background: 'rgba(142, 142, 147, 0.12)',
                                            color: '#000',
                                            cursor: 'pointer',
                                            appearance: 'none',
                                            outline: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <option value="">Sort By</option>
                                        <option value="title-asc">Event Name (A-Z)</option>
                                        <option value="title-desc">Event Name (Z-A)</option>
                                        <option value="date-asc">Event Date (Earliest)</option>
                                        <option value="date-desc">Event Date (Latest)</option>
                                        <option value="submitted-asc">Submitted (Oldest)</option>
                                        <option value="submitted-desc">Submitted (Newest)</option>
                                    </select>
                                    <ChevronDown style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93', pointerEvents: 'none' }} size={16} />
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>
                        ) : filteredAndSortedPendingEvents.length > 0 ? (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem',
                                    marginBottom: '2rem',
                                }}
                            >
                                {filteredAndSortedPendingEvents.map((event, index) => {
                                    const eventId = event._id?.$oid || event._id || `event-${index}`;
                                    return (
                                        <PendingEventsCard
                                            key={`${eventId}-${event.eventName}-${index}`}
                                            event={event}
                                            onActionComplete={refetchPendingEvents}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <div
                                style={{
                                    padding: '3rem',
                                    textAlign: 'center',
                                    color: '#6b7280',
                                    fontSize: '1rem',
                                }}
                            >
                                {eventSearchQuery ? 'No matching events found' : 'You\'re done!'}
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    );
};

export default AdminDashboard;