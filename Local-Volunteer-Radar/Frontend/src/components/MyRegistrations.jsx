import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    const loadRegistrations = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!loggedInUser) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log('Fetching registrations for user ID:', loggedInUser.id);

            // Fetch registrations from API
            const response = await fetch(
                `http://localhost:5000/api/events/volunteer/${loggedInUser.id}/registrations`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch registrations');
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.success) {
                setRegistrations(data.registrations);
            } else {
                console.error('Failed to load registrations:', data.message);
            }
        } catch (error) {
            console.error('Error loading registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRegistrations();
    }, []);

    const filteredRegistrations = filter === 'All'
        ? registrations
        : registrations.filter(reg => reg.registrationStatus.toLowerCase() === filter.toLowerCase());

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: '#FEF3C7', color: '#92400E', icon: AlertCircle },
            approved: { bg: '#D1FAE5', color: '#065F46', icon: CheckCircle },
            rejected: { bg: '#FEE2E2', color: '#991B1B', icon: XCircle }
        };

        const normalizedStatus = status.toLowerCase();
        const style = styles[normalizedStatus] || styles.pending;
        const Icon = style.icon;

        return (
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                background: style.bg,
                color: style.color,
                fontSize: '0.875rem',
                fontWeight: '600'
            }}>
                <Icon size={16} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
        );
    };

    const getCountByStatus = (status) => {
        if (status === 'All') return registrations.length;
        return registrations.filter(r => r.registrationStatus.toLowerCase() === status.toLowerCase()).length;
    };

    if (loading) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#6b7280'
            }}>
                <p style={{ fontSize: '1rem' }}>Loading your registrations...</p>
            </div>
        );
    }

    if (registrations.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#6b7280'
            }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    No registrations yet
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                    Browse available events and register to start making a difference in your community!
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Filter Buttons */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap'
            }}>
                {['All', 'Pending', 'Approved', 'Rejected'].map((filterOption) => (
                    <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid',
                            borderColor: filter === filterOption ? '#3b82f6' : '#e5e7eb',
                            background: filter === filterOption ? '#eff6ff' : 'white',
                            color: filter === filterOption ? '#3b82f6' : '#6b7280',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            if (filter !== filterOption) {
                                e.currentTarget.style.background = '#f9fafb';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (filter !== filterOption) {
                                e.currentTarget.style.background = 'white';
                            }
                        }}
                    >
                        {filterOption} ({getCountByStatus(filterOption)})
                    </button>
                ))}
            </div>

            {/* Registration Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
            }}>
                {filteredRegistrations.map((reg, index) => {
                    const event = reg.event;

                    if (!event) return null; // safety check

                    return (
                        <div
                            key={index}
                            style={{
                                background: 'white',
                                border: '2px solid #e5e7eb',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                marginBottom: '1rem'
                            }}>
                                <div style={{ flex: 1, marginRight: '1rem' }}>
                                    <h3 style={{
                                        fontSize: '1.125rem',
                                        fontWeight: 'bold',
                                        color: '#111827',
                                        margin: '0 0 0.25rem 0'
                                    }}>
                                        {event.eventName}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: '#6b7280',
                                        margin: 0
                                    }}>
                                        Organized by: {event.organizerId?.name || 'Unknown'}
                                    </p>
                                </div>
                                {getStatusBadge(reg.registrationStatus)}
                            </div>

                            {/* Event Description */}
                            {event.description && (
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#4b5563',
                                    margin: '0 0 1rem 0',
                                    lineHeight: '1.4'
                                }}>
                                    {event.description.length > 120
                                        ? event.description.substring(0, 120) + '...'
                                        : event.description}
                                </p>
                            )}

                            {/* Event Details */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                marginBottom: '1rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    color: '#4b5563'
                                }}>
                                    <Calendar size={16} style={{ color: '#3b82f6' }} />
                                    <span>
                                        {`${new Date(event.startdate).toLocaleDateString('en-US', {
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
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    color: '#4b5563'
                                }}>
                                    <Clock size={16} style={{ color: '#10b981' }} />
                                    <span>{event.startTime} - {event.endTime}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    color: '#4b5563'
                                }}>
                                    <MapPin size={16} style={{ color: '#ef4444' }} />
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            {/* Registration Date */}
                            {reg.registeredAt && (
                                <div style={{
                                    paddingTop: '1rem',
                                    borderTop: '1px solid #e5e7eb',
                                    fontSize: '0.75rem',
                                    color: '#9ca3af'
                                }}>
                                    Registered on {new Date(reg.registeredAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredRegistrations.length === 0 && filter !== 'All' && (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#6b7280'
                }}>
                    <p>No {filter.toLowerCase()} registrations</p>
                </div>
            )}
        </div>
    );
};

export default MyRegistrations;
