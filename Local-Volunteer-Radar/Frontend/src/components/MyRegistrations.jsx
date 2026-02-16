import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const MyRegistrations = ({ showToast }) => {
    const [registrations, setRegistrations] = useState([]);
    const [filter, setFilter] = useState('All');

    const loadRegistrations = () => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!loggedInUser) {
            if (showToast) {
                showToast('Please login to view registrations', 'warning');
            }
            return;
        }

        const allRegistrations = JSON.parse(localStorage.getItem('eventRegistrations')) || [];
        const userRegistrations = allRegistrations.filter(
            reg => reg.volunteerEmail === loggedInUser.email
        );
        console.log(userRegistrations);

        setRegistrations(userRegistrations);
    };

    useEffect(() => {
        loadRegistrations();
    }, []);

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        setEvents(storedEvents);
    }, []);

    const filteredRegistrations = filter === 'All'
        ? registrations
        : registrations.filter(reg => reg.status === filter);

    const getStatusBadge = (status) => {
        const styles = {
            Pending: { bg: '#FEF3C7', color: '#92400E', icon: AlertCircle },
            Approved: { bg: '#D1FAE5', color: '#065F46', icon: CheckCircle },
            Rejected: { bg: '#FEE2E2', color: '#991B1B', icon: XCircle }
        };

        const style = styles[status] || styles.Pending;
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
                {status}
            </div>
        );
    };

    if (registrations.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#6b7280'
            }}>
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
                    >
                        {filterOption} ({filterOption === 'All' ? registrations.length : registrations.filter(r => r.status === filterOption).length})
                    </button>
                ))}
            </div>

            {/* Registration Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
            }}>
                {filteredRegistrations.map((reg) =>{

                    const event = events.find(ev => ev.id === reg.eventId);

                    if (!event) return null; // safety check

                    return(
                        <div
                            key={reg.id}
                            style={{
                                background: 'white',
                                border: '2px solid #e5e7eb',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s'
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                marginBottom: '1rem'
                            }}>
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 'bold',
                                    color: '#111827',
                                    margin: 0,
                                    flex: 1
                                }}>
                                    {event.eventName}
                                </h3>
                                {getStatusBadge(reg.status)}
                            </div>

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
                                    <span>{event.startdate}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    color: '#4b5563'
                                }}>
                                    <Clock size={16} style={{ color: '#10b981' }} />
                                    <span>{event.startTime}&nbsp;-&nbsp;{event.endTime}</span>
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
                            <div style={{
                                paddingTop: '1rem',
                                borderTop: '1px solid #e5e7eb',
                                fontSize: '0.75rem',
                                color: '#9ca3af'
                            }}>
                                Registered on {new Date(reg.registeredAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            </div>
                        </div>
                    )})}
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
