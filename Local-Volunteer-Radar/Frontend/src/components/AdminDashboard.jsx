import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Users, HandFist, Building, Dumbbell, Sparkles, MapPin, Radio, Search, ChevronDown, X } from 'lucide-react';
import StatCard from './StatCard';
import EventCard from './EventCard';
import AdminNavbar from "./AdminNavbar.jsx";
import AdminAnalytics from "./AdminAnalytics.jsx";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('discover');
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Category');
    const [selectedType, setSelectedType] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [sortBy, setSortBy] = useState('');

    const navigate = useNavigate();

    const handleLogoutClick = () => {
        navigate('/login');
    };

    const stats = [
        {
            id: 1,
            title: 'Total Volunteers',
            value: '170',
            subtitle: 'Volunteers across the country',
            icon: Users,
            iconColor: '#3b82f6',
            iconBg: '#dbeafe'
        },
        {
            id: 2,
            title: 'Active Volunteers',
            value: '88',
            subtitle: 'Currently volunteering',
            icon: HandFist,
            iconColor: '#10b981',
            iconBg: '#d1fae5'
        },
        {
            id: 3,
            title: 'Total Organizers',
            value: 39,
            subtitle: 'Organizers registered',
            icon: Building,
            iconColor: '#06b6d4',
            iconBg: '#cffafe'
        },
        {
            id: 4,
            title: 'Active Organizers',
            value: '20',
            subtitle: 'Organizers currently working',
            icon: Dumbbell,
            iconColor: '#a855f7',
            iconBg: '#f3e8ff'
        }
    ];

    const users = [
        {
            id: 1,
            name: 'Buzz Osborne',
            email: 'buzz@example.com',
            status: 'Active',
            type: 'Volunteer',
            joined: '25 Jun 2025',
            fullJoinDate: 'June 25, 2024',
            phone: '+1 (555) 123-4567',
            address: '123 Main St, New York, NY 10001',
            skills: ['First-Aid', 'Distribution'],
            hoursVolunteered: 45
        },
        {
            id: 2,
            name: 'Lucas Harrington',
            email: 'lucas@example.com',
            status: 'Active',
            type: 'Volunteer',
            joined: '1 Jun 2025',
            fullJoinDate: 'June 1, 2024',
            phone: '+1 (555) 234-5678',
            address: '456 Oak Ave, Boston, MA 02101',
            skills: ['Education', 'Environment'],
            hoursVolunteered: 32
        },
        {
            id: 3,
            name: 'ABC Charity',
            email: 'abcch@example.com',
            status: 'Active',
            type: 'NGO',
            joined: '24 Apr 2025',
            fullJoinDate: 'April 24, 2024',
            phone: '+1 (555) 345-6789',
            address: '789 Charity Lane, Chicago, IL 60601',
            category: 'Education',
            registrationNumber: 'NGO-2024-001',
            membersCount: 150
        },
        {
            id: 4,
            name: 'Zara Patel',
            email: 'zpatel@example.com',
            status: 'Inactive',
            type: 'Volunteer',
            joined: '30 Jan 2025',
            fullJoinDate: 'January 30, 2024',
            phone: '+1 (555) 456-7890',
            address: '321 Elm St, Seattle, WA 98101',
            skills: ['First-Aid', 'Education'],
            hoursVolunteered: 78
        },
        {
            id: 5,
            name: 'T. Park',
            email: 'theop@example.com',
            status: 'Active',
            type: 'Volunteer',
            joined: '2 Dec 2025',
            fullJoinDate: 'December 2, 2023',
            phone: '+1 (555) 567-8901',
            address: '654 Pine Rd, Austin, TX 73301',
            skills: ['Distribution', 'Environment'],
            hoursVolunteered: 120
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

    const allEvents = [
        {
            id: 3,
            title: 'Emergency Medical Camp Setup',
            description: 'Urgent need for medical volunteers for health camp',
            tags: [
                { name: 'first-aid', type: 'skill' },
                { name: '4 spots left', type: 'spots' }
            ],
            date: 'Wednesday, December 24',
            time: '08:00 - 14:00',
            location: '716, Kafrul, Noakhali',
            distance: '3.2km away',
            requirements: 'First-aid, medical'
        },
        {
            id: 4,
            title: 'Community Food Drive',
            description: 'Help distribute food to families in need',
            tags: [
                { name: 'distribution', type: 'skill' },
                { name: '4 spots left', type: 'spots' }
            ],
            date: 'Friday, December 26',
            time: '10:00 - 16:00',
            location: '716, Pallabi, Dhaka',
            distance: '3.2km away',
            requirements: 'Distribution, crowd management'
        },
        {
            id: 5,
            title: 'Relief Distribution',
            description: 'Help distribute food to families in need',
            tags: [
                { name: 'distribution', type: 'skill' },
                { name: '5 spots left', type: 'spots' }
            ],
            date: 'Friday, December 26',
            time: '10:00 - 16:00',
            location: '716, Pallabi, Sylhet',
            distance: '3.2km away',
            requirements: 'Distribution, crowd management'
        },
        {
            id: 6,
            title: 'Winter Dress Distribution',
            description: 'Help distribute winter dress to families in need',
            tags: [
                { name: 'distribution', type: 'skill' },
                { name: '3 spots left', type: 'spots' }
            ],
            date: 'Friday, December 26',
            time: '10:00 - 16:00',
            location: '716, Pallabi, Barishal',
            distance: '3.2km away',
            requirements: 'Distribution, crowd management'
        }
    ];

    const [, setFilteredEvents] = useState(allEvents);

    // Filter function
    const handleFilter = () => {
        let filtered = [...allEvents];

        // Filter by search query
        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                //
                // event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.requirements.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'All Category') {
            filtered = filtered.filter(event => {
                // Check if any tag matches the category
                return event.tags.some(tag =>
                    tag.name.toLowerCase().includes(selectedCategory.toLowerCase())
                ) || event.requirements.toLowerCase().includes(selectedCategory.toLowerCase());
            });
        }

        setFilteredEvents(filtered);
    };

// Call filter when search or category changes
    React.useEffect(() => {
        handleFilter();
    }, [searchQuery, selectedCategory]);

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)' }}>
            {/* Navbar */}
            <AdminNavbar
                userName="Adib Hoque"
                title = "Admin Dashboard"
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
                        />
                    ))}
                </div>

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
                        onClick={() => setActiveTab('discover')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.625rem',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: activeTab === 'discover' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                            color: activeTab === 'discover' ? '#111827' : '#4b5563',
                            boxShadow: activeTab === 'discover' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'discover') {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                e.currentTarget.style.color = '#374151';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'discover') {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#4b5563';
                            }
                        }}
                    >
                        Partners
                    </button>
                    <button
                        onClick={() => setActiveTab('registrations')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.625rem',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: activeTab === 'registrations' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                            color: activeTab === 'registrations' ? '#111827' : '#4b5563',
                            boxShadow: activeTab === 'registrations' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'registrations') {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                e.currentTarget.style.color = '#374151';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'registrations') {
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

                {/* Tab Content */}
                {activeTab === 'registrations' && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        marginBottom: '2rem' }}>
                        {stats.map((stat) => (
                            <AdminAnalytics

                            />
                        ))}
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div style={{
                        background: 'white',
                        borderRadius: '1rem',
                        padding: '2rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        marginBottom: '2rem'
                    }}>
                        {/* Header with icon */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '0.5rem'
                        }}>
                            <div style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                background: '#14b8a6',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: '#111827',
                                    margin: 0
                                }}>
                                    Notifications
                                </h2>
                                <p style={{
                                    fontSize: '0.75rem',
                                    color: '#6b7280',
                                    margin: 0
                                }}>
                                    0 unread notification
                                </p>
                            </div>
                        </div>

                        {/* Empty state */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '3rem 0',
                            textAlign: 'center'
                        }}>
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#9ca3af"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ marginBottom: '1rem' }}
                            >
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#6b7280',
                                margin: 0
                            }}>
                                No notifications yet
                            </p>
                        </div>
                    </div>
                )}

                {/* Show events only on Discover tab */}
                {activeTab === 'discover' && (
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
                                        onFocus={(e) => {
                                            e.currentTarget.style.background = 'rgba(142, 142, 147, 0.18)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.background = 'rgba(142, 142, 147, 0.12)';
                                        }}
                                    />
                                </div>

                                <div style={{ position: 'relative', width: '160px', minWidth: '160px' }}>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
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
                                        onFocus={(e) => {
                                            e.currentTarget.style.background = 'rgba(142, 142, 147, 0.18)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.background = 'rgba(142, 142, 147, 0.12)';
                                        }}
                                    >
                                        <option value="">All Categories</option>
                                        <option value="first-aid">First-Aid</option>
                                        <option value="distribution">Distribution</option>
                                        <option value="education">Education</option>
                                        <option value="environment">Environment</option>
                                    </select>
                                    <ChevronDown style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93', pointerEvents: 'none' }} size={16} />
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
                                        onFocus={(e) => {
                                            e.currentTarget.style.background = 'rgba(142, 142, 147, 0.18)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.background = 'rgba(142, 142, 147, 0.12)';
                                        }}
                                    >
                                        <option value="">All Types</option>
                                        <option value="volunteer">Volunteer</option>
                                        <option value="ngo">NGO</option>
                                    </select>
                                    <ChevronDown style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93', pointerEvents: 'none' }} size={16} />
                                </div>

                                <div style={{ position: 'relative', width: '150px', minWidth: '150px' }}>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
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
                                        onFocus={(e) => {
                                            e.currentTarget.style.background = 'rgba(142, 142, 147, 0.18)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.background = 'rgba(142, 142, 147, 0.12)';
                                        }}
                                    >
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
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
                                        onFocus={(e) => {
                                            e.currentTarget.style.background = 'rgba(142, 142, 147, 0.18)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.background = 'rgba(142, 142, 147, 0.12)';
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
                                    <div>STATUS</div>
                                    <div>TYPE</div>
                                    <div>JOINED</div>
                                </div>

                                {/* Table Rows */}
                                {users.map((user) => (
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
                                        <div style={{ color: '#2563eb', fontSize: '0.875rem' }}>{user.email}</div>

                                        {/* Status Badge */}
                                        <div>
                                          <span style={{
                                              padding: '0.375rem 0.75rem',
                                              borderRadius: '1rem',
                                              fontSize: '0.75rem',
                                              fontWeight: '500',
                                              background: user.status === 'Active' ? '#dcfce7' : '#fcdcf1',
                                              color: user.status === 'Active' ? '#166534' : '#65161f'
                                          }}>
                                            {user.status}
                                          </span>
                                        </div>

                                        {/* Type Badge */}
                                        <div>
                                          <span style={{
                                              padding: '0.375rem 0.75rem',
                                              borderRadius: '1rem',
                                              fontSize: '0.75rem',
                                              fontWeight: '500',
                                              background: user.type === 'Volunteer' ? '#fef3c7' : '#e9d5ff',
                                              color: user.type === 'Volunteer' ? '#92400e' : '#6b21a8'
                                          }}>
                                            {user.type}
                                          </span>
                                        </div>

                                        {/* Joined Date */}
                                        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{user.joined}</div>
                                    </div>
                                ))}
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
                                                <span style={{ color: '#6b7280', fontWeight: '500' }}>Status</span>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '1rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500',
                                                    background: selectedUser.status === 'Active' ? '#dcfce7' : '#fcdcf1',
                                                    color: selectedUser.status === 'Active' ? '#166534' : '#65161f'
                                                }}>
                                                  {selectedUser.status}
                                                </span>
                                            </div>

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
            </div>
        </div>
    );
};

export default AdminDashboard;