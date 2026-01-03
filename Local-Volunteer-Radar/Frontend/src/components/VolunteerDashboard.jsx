import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, CheckCircle, Clock, Calendar, TrendingUp, Sparkles, MapPin, Radio, Search, ChevronDown } from 'lucide-react';
import Navbar from './Navbar';
import StatCard from './StatCard';
import EventCard from './EventCard';

const VolunteerDashboard = () => {
    const [activeTab, setActiveTab] = useState('discover');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Category');

    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/volunteer-profile');
    };

    const handleLogoutClick = () => {
        navigate('/login');
    };

    const stats = [
        {
            id: 1,
            title: 'Events Completed',
            value: '12',
            subtitle: 'Successfully completed',
            icon: CheckCircle,
            iconColor: '#3b82f6',
            iconBg: '#dbeafe'
        },
        {
            id: 2,
            title: 'Hours Volunteered',
            value: '40',
            subtitle: 'Hours contributed',
            icon: Clock,
            iconColor: '#10b981',
            iconBg: '#d1fae5'
        },
        {
            id: 3,
            title: 'Active Registration',
            value: '0',
            subtitle: 'Upcoming events',
            icon: Calendar,
            iconColor: '#06b6d4',
            iconBg: '#cffafe'
        },
        {
            id: 4,
            title: 'Skills Utilized',
            value: '2',
            subtitle: 'Active skill categories',
            icon: TrendingUp,
            iconColor: '#a855f7',
            iconBg: '#f3e8ff'
        }
    ];

    const events = [
        {
            id: 1,
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
            id: 2,
            title: 'Community Food Drive',
            description: 'Help distribute food to families in need',
            tags: [
                { name: 'distribution', type: 'skill' },
                { name: '4 spots left', type: 'spots' }
            ],
            date: 'Friday, December 26',
            time: '10:00 - 16:00',
            location: '716, Kafrul, Noakhali',
            distance: '3.2km away',
            requirements: 'Distribution, crowd management'
        }
    ];

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
            location: '716, Kafrul, Noakhali',
            distance: '3.2km away',
            requirements: 'Distribution, crowd management'
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)' }}>
            {/* Navbar */}
            <Navbar
                userName="Joel Miller"
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
                        />
                    ))}
                </div>

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
                            boxShadow: activeTab === 'notifications' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                        }}
                        onMouseOver={(e) => { if (activeTab !== 'notifications') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)' }}
                        onMouseOut={(e) => { if (activeTab !== 'notifications') e.currentTarget.style.background = 'transparent' }}
                    >
                        Notifications
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
                            margin: '0 0 0.5rem 0'
                        }}>
                            My Registrations
                        </h2>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            margin: '0 0 1rem 0'
                        }}>
                            You haven't registered for any events yet
                        </p>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#4b5563',
                            margin: 0
                        }}>
                            Browse available events and register to start making a difference in your community!
                        </p>
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

                        {/* Recommended Section */}
                        <div style={{ background: 'linear-gradient(to right, #eff6ff, #eef2ff)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #dbeafe', boxShadow: '0 10px 20px -3px rgba(0, 0, 0, 0.15)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Sparkles size={20} style={{ color: '#3b82f6' }} />
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Recommended For You</h2>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>Events matching your skills and location</p>
                        </div>

                        {/* Event Cards - Recommended */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            {events.map((event) => (
                                <EventCard
                                    key={event.id}
                                    title={event.title}
                                    description={event.description}
                                    tags={event.tags}
                                    date={event.date}
                                    time={event.time}
                                    location={event.location}
                                    distance={event.distance}
                                    requirements={event.requirements}
                                    onRegister={() => console.log(`Register for ${event.title}`)}
                                />
                            ))}
                        </div>

                        {/* Search and Filter Section */}
                        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                                <div style={{ position: 'relative', width: '100%' }}>
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
                                        <option>Medical</option>
                                        <option>Food Distribution</option>
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
                            <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>2 opportunities</span>
                        </div>

                        {/* Event Cards - All Events */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {allEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    title={event.title}
                                    description={event.description}
                                    tags={event.tags}
                                    date={event.date}
                                    time={event.time}
                                    location={event.location}
                                    distance={event.distance}
                                    requirements={event.requirements}
                                    onRegister={() => console.log(`Register for ${event.title}`)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default VolunteerDashboard;