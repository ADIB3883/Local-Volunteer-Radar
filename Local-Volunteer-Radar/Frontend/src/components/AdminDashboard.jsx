import React, {useMemo, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building, Search, ChevronDown, X, Sparkles } from 'lucide-react';
import StatCard from './StatCard.jsx';
import AdminNavbar from "./AdminNavbar.jsx";
import AdminAnalytics from "./AdminAnalytics.jsx";
import PendingUserCard from './PendingUserCard.jsx';
import PendingEventsCard from "./PendingEventsCard.jsx";
import Modal from './Modal';
import TotalVolunteerModal from './TotalVolunteerModal';
import TotalOrganizerModal from './TotalOrganizerModal';
import ActiveEventsModal from './ActiveEventsModal';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('partner');
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [modalOpen, setModalOpen] = useState(null);
    const [users, setUsers] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const pendingUsers = users.filter(user => !user.isApproved);
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [pendingSearchQuery, setPendingSearchQuery] = useState('');
    const [pendingTypeFilter, setPendingTypeFilter] = useState('');
    const [pendingSortBy, setPendingSortBy] = useState('');
    const [eventSearchQuery, setEventSearchQuery] = useState('');
    const [eventSortBy, setEventSortBy] = useState('');

    // Fetch users from backend API
    useEffect(() => {
        fetch('http://localhost:5000/api/users')
            .then(res => res.json())
            .then(data => setUsers(data.users))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const refetchUsers = () => {
        fetch('http://localhost:5000/api/users')
            .then(res => res.json())
            .then(data => setUsers(data.users))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetch("http://localhost:5000/api/admin/events/pending") // your backend route
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched events:", data.events); // debug log
                setPendingEvents(data.events || []); // set state
            })
            .catch((err) => {
                console.error("Error fetching pending events:", err);
            })
            .finally(() => setLoading(false)); // stop loading spinner
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/admin/analytics")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched analytics:", data);
                setAnalytics(data);
            })
            .catch((err) => {
                console.error("Error fetching analytics:", err);
            });
    }, []);

    // Filtered and sorted users
    const filteredAndSortedUsers = useMemo(() => {
        if (!users || users.length === 0) return [];

        let filtered = [...users];

        // Search by name
        if (searchQuery.trim()) {
            filtered = filtered.filter(u =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by type
        if (selectedType) {
            const typeValue = selectedType.charAt(0).toLowerCase() + selectedType.slice(1);
            filtered = filtered.filter(u => u.type === typeValue);
        }

        // Sorting
        if (sortBy) {
            filtered.sort((a, b) => {
                switch (sortBy) {
                    case 'name-asc':
                        return a.name.localeCompare(b.name);
                    case 'name-desc':
                        return b.name.localeCompare(a.name);
                    case 'date-asc':
                        return new Date(a.joinedDate) - new Date(b.joinedDate);
                    case 'date-desc':
                        return new Date(b.joinedDate) - new Date(a.joinedDate);
                    case 'email-asc':
                        return a.email.localeCompare(b.email);
                    case 'email-desc':
                        return b.email.localeCompare(a.email);
                    default:
                        return 0;
                }
            });
        }

        return filtered;
    }, [users, searchQuery, selectedType, sortBy]);

    // Filter and sort pending users
    const filteredAndSortedPendingUsers = useMemo(() => {
        let filtered = [...pendingUsers];

        // Apply search filter
        if (pendingSearchQuery) {
            const query = pendingSearchQuery.toLowerCase();
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                user.phoneNumber?.toLowerCase().includes(query) ||
                user.address?.toLowerCase().includes(query)
            );
        }

        // Apply type filter
        if (pendingTypeFilter) {
            filtered = filtered.filter(user => user.type === pendingTypeFilter);
        }

        // Apply sorting
        if (pendingSortBy) {
            filtered.sort((a, b) => {
                switch (pendingSortBy) {
                    case 'name-asc':
                        return (a.name || '').localeCompare(b.name || '');
                    case 'name-desc':
                        return (b.name || '').localeCompare(a.name || '');
                    case 'date-asc':
                        return new Date(a.joinedDate || a.createdAt) - new Date(b.joinedDate || b.createdAt);
                    case 'date-desc':
                        return new Date(b.joinedDate || b.createdAt) - new Date(a.joinedDate || a.createdAt);
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

// Filter and sort pending events
    const filteredAndSortedPendingEvents = useMemo(() => {
        let filtered = [...pendingEvents];

        // Apply search filter
        if (eventSearchQuery) {
            const query = eventSearchQuery.toLowerCase();
            filtered = filtered.filter(event =>
                event.title?.toLowerCase().includes(query) ||
                event.description?.toLowerCase().includes(query) ||
                event.location?.toLowerCase().includes(query) ||
                event.organizerName?.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        if (eventSortBy) {
            filtered.sort((a, b) => {
                switch (eventSortBy) {
                    case 'title-asc':
                        return (a.title || '').localeCompare(b.title || '');
                    case 'title-desc':
                        return (b.title || '').localeCompare(a.title || '');
                    case 'date-asc':
                        return new Date(a.eventDate || a.date) - new Date(b.eventDate || b.date);
                    case 'date-desc':
                        return new Date(b.eventDate || b.date) - new Date(a.eventDate || a.date);
                    case 'submitted-asc':
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    case 'submitted-desc':
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    default:
                        return 0;
                }
            });
        }

        return filtered;
    }, [pendingEvents, eventSearchQuery, eventSortBy]);

    const navigate = useNavigate();

    const handleAnnouncementsClick = () => {

    };

    const handleLogoutClick = () => {
        navigate('/login');
    };

    const totalVolunteers = useMemo(
        () => users?.filter(u => u.type === 'volunteer').length || 0,
        [users]
    );

    const totalOrganizers = useMemo(
        () => users?.filter(u => u.type === 'organizer').length || 0,
        [users]
    );

    const stats = [
        {
            id: 'volunteers',
            title: 'Total Volunteers',
            value: totalVolunteers,
            subtitle: 'Volunteers across the country',
            icon: Users,
            iconColor: '#3b82f6',
            iconBg: '#dbeafe',
            modalTitle: 'Total Volunteers',
            modalContent: <TotalVolunteerModal />
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
            modalContent: <TotalOrganizerModal />
        },
        {
            id: 'events',
            title: 'Active Events',
            value: '2',
            subtitle: 'Events taking place',
            icon: Sparkles,
            iconColor: '#a855f7',
            iconBg: '#f3e8ff',
            modalTitle: 'Ongoing Events',
            modalContent: <ActiveEventsModal />
        }
    ];

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getAvatarColor = (name) => {
        const colors = ['#7c3aed', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const closeModal = () => {
        setSelectedUser(null);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)' }}>
            {/* Navbar */}
            <AdminNavbar
                title="Admin Dashboard"
                onAnnouncementsClick={handleAnnouncementsClick}
                onLogoutClick={handleLogoutClick}
            />


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
                    {/*<button*/}
                    {/*    onClick={() => setActiveTab('analytics')}*/}
                    {/*    style={{*/}
                    {/*        padding: '0.5rem 1rem',*/}
                    {/*        borderRadius: '0.625rem',*/}
                    {/*        fontWeight: '500',*/}
                    {/*        fontSize: '0.875rem',*/}
                    {/*        border: 'none',*/}
                    {/*        cursor: 'pointer',*/}
                    {/*        transition: 'all 0.2s ease',*/}
                    {/*        background: activeTab === 'analytics' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',*/}
                    {/*        color: activeTab === 'analytics' ? '#111827' : '#4b5563',*/}
                    {/*        boxShadow: activeTab === 'analytics' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',*/}
                    {/*        whiteSpace: 'nowrap'*/}
                    {/*    }}*/}
                    {/*    onMouseEnter={(e) => {*/}
                    {/*        if (activeTab !== 'analytics') {*/}
                    {/*            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';*/}
                    {/*            e.currentTarget.style.color = '#374151';*/}
                    {/*        }*/}
                    {/*    }}*/}
                    {/*    onMouseLeave={(e) => {*/}
                    {/*        if (activeTab !== 'analytics') {*/}
                    {/*            e.currentTarget.style.background = 'transparent';*/}
                    {/*            e.currentTarget.style.color = '#4b5563';*/}
                    {/*        }*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    Analytics*/}
                    {/*</button>*/}
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
                        onMouseEnter={(e) => {
                            if (activeTab !== 'pendingEvents') {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                e.currentTarget.style.color = '#374151';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'pendingEvents') {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#4b5563';
                            }
                        }}
                    >
                        Pending Events
                    </button>
                </div>

                {/*{activeTab === 'analytics' && (*/}
                {/*    <div style={{ marginBottom: '1.5rem' }}>*/}
                {/*        <AdminAnalytics analytics={analytics} />*/}
                {/*    </div>*/}
                {/*)}*/}

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
                                        <option value="ngo">NGO</option>
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

                        {/* Partners' List Section */}
                        <div style={{ margin: '0 auto' }}>
                            <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                                {/* Table Header */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                                    gap: '1rem',
                                    padding: '1rem 1.5rem',
                                    borderBottom: '1px solid #f3f4f6',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#6b7280',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
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
                                            key={user.id}
                                            onClick={() => setSelectedUser(user)}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                                                gap: '1rem',
                                                padding: '1rem 1.5rem',
                                                borderBottom: '1px solid #f3f4f6',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            {/* Name with Avatar */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '2.5rem',
                                                    height: '2.5rem',
                                                    borderRadius: '50%',
                                                    background: getAvatarColor(user.name),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: '600',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {getInitials(user.name)}
                                                </div>
                                                <span style={{ fontWeight: '500', color: '#111827' }}>{user.name}</span>
                                            </div>

                                            {/* Email */}
                                            <div style={{ color: '#00000', fontSize: '0.875rem' }}>{user.email}</div>

                                            {/* Type Badge */}
                                            <div>
                                          <span style={{
                                              padding: '0.375rem 0.75rem',
                                              borderRadius: '1rem',
                                              fontSize: '0.75rem',
                                              fontWeight: '500',
                                              background: user.type === 'volunteer' ? '#fef3c7' :
                                                  user.type === 'ngo' ? '#dbeafe' : '#f3e8ff',
                                              color: user.type === 'volunteer' ? '#92400e' :
                                                  user.type === 'ngo' ? '#1e40af' : '#7c2d12'
                                          }}>
                                            {user.type.toUpperCase()}
                                          </span>
                                            </div>

                                            {/* Joined Date */}
                                            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{user.joined}</div>
                                        </div>
                                    ))}
                                {filteredAndSortedUsers.length === 0 && (
                                    <div style={{
                                        padding: '3rem',
                                        textAlign: 'center',
                                        color: '#6b7280'
                                    }}>
                                        No partners found
                                    </div>
                                )}
                            </div>

                            {/* Modal Popup */}
                            {selectedUser && (
                                <div
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'rgba(0, 0, 0, 0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 50,
                                        padding: '1rem'
                                    }}
                                    onClick={closeModal}
                                >
                                    <div
                                        style={{
                                            background: 'white',
                                            borderRadius: '1rem',
                                            padding: '2rem',
                                            maxWidth: '500px',
                                            width: '100%',
                                            maxHeight: '90vh',
                                            overflowY: 'auto',
                                            position: 'relative'
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Close Button */}
                                        <button
                                            onClick={closeModal}
                                            style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                background: '#f3f4f6',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '2rem',
                                                height: '2rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                        >
                                            <X size={18} />
                                        </button>

                                        {/* Avatar and Name */}
                                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                            <div style={{
                                                width: '5rem',
                                                height: '5rem',
                                                borderRadius: '50%',
                                                background: getAvatarColor(selectedUser.name),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: '600',
                                                fontSize: '1.5rem',
                                                margin: '0 auto 1rem'
                                            }}>
                                                {getInitials(selectedUser.name)}
                                            </div>
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                                                {selectedUser.name}
                                            </h2>
                                            <p style={{ color: '#6b7280', margin: 0 }}>{selectedUser.email}</p>
                                        </div>

                                        {/* User Details */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                                <span style={{ color: '#6b7280', fontWeight: '500' }}>Type</span>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '1rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500',
                                                    background: selectedUser.type === 'Volunteer' ? '#fef3c7' : '#e9d5ff',
                                                    color: selectedUser.type === 'Volunteer' ? '#92400e' : '#6b21a8'
                                                }}>
                                                  {selectedUser.type}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                                <span style={{ color: '#6b7280', fontWeight: '500' }}>Email Address</span>
                                                <span style={{ fontWeight: '500' }}>{selectedUser.email}</span>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                                <span style={{ color: '#6b7280', fontWeight: '500' }}>Joined</span>
                                                <span style={{ fontWeight: '500' }}>{selectedUser.fullJoinDate}</span>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                                <span style={{ color: '#6b7280', fontWeight: '500' }}>Phone</span>
                                                <span style={{ fontWeight: '500' }}>{selectedUser.phone}</span>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                                <span style={{ color: '#6b7280', fontWeight: '500' }}>Address</span>
                                                <span style={{ fontWeight: '500', textAlign: 'right', maxWidth: '60%' }}>{selectedUser.address}</span>
                                            </div>

                                            {selectedUser.type === 'Volunteer' ? (
                                                <>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Skills</span>
                                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '60%' }}>
                                                            {selectedUser.skills.map((skill, index) => (
                                                                <span key={index} style={{
                                                                    padding: '0.25rem 0.625rem',
                                                                    borderRadius: '0.375rem',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: '500',
                                                                    background: '#f3f4f6',
                                                                    color: '#374151'
                                                                }}>
                                                                  {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
                                                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Hours Volunteered</span>
                                                        <span style={{ fontWeight: '600', color: '#7c3aed' }}>{selectedUser.hoursVolunteered}h</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Category</span>
                                                        <span style={{ fontWeight: '500' }}>{selectedUser.category}</span>
                                                    </div>

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Registration No.</span>
                                                        <span style={{ fontWeight: '500' }}>{selectedUser.registrationNumber}</span>
                                                    </div>

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
                                                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Members</span>
                                                        <span style={{ fontWeight: '600', color: '#7c3aed' }}>{selectedUser.membersCount}</span>
                                                    </div>
                                                </>
                                            )}
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
                                        placeholder="Search pending users..."
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
                                        <option value="ngo">NGO</option>
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

                        {filteredAndSortedPendingUsers.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(410px, 410px))',
                                gap: '1.5rem',
                                justifyContent: 'start',
                            }}>
                                {filteredAndSortedPendingUsers
                                    .filter(user => user.type !== 'admin')
                                    .map((user) => (
                                        <PendingUserCard
                                            key={user.id}
                                            user={user}
                                            onActionComplete={refetchUsers}
                                        />
                                    ))}
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

                {/* Pending Events Tab */}
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
                                        <option value="title-asc">Title (A-Z)</option>
                                        <option value="title-desc">Title (Z-A)</option>
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
                                {filteredAndSortedPendingEvents.map((event) => (
                                    <PendingEventsCard
                                        key={event.eventId}
                                        event={event}
                                        onActionComplete={() =>
                                            setPendingEvents((prev) =>
                                                prev.filter((e) => e.eventId !== event.eventId)
                                            )
                                        }
                                    />
                                ))}
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