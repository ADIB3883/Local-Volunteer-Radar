import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, Building2 } from 'lucide-react';

const ActiveRegistrationModal = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchActiveRegistrations();
    }, []);

    const fetchActiveRegistrations = async () => {
        try {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!loggedInUser?.email) {
                setError("User not found.");
                return;
            }

            const res = await fetch(`http://localhost:5000/api/events/volunteer/${loggedInUser.email}/registrations`);
            const data = await res.json();

            if (!data.success) {
                setError("Failed to fetch registrations.");
                return;
            }

            // Active = event is active AND volunteer's status is approved or pending
            const active = data.registrations.filter(
                reg => reg.registrationStatus === 'approved' &&
                    reg.event.status !== 'completed' &&
                    reg.event.status !== 'cancelled'
            );

            setRegistrations(active);
        } catch (err) {
            console.error("Error fetching active registrations:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (startdate, enddate) => {
        if (!startdate) return 'N/A';
        const start = new Date(startdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        if (!enddate || enddate === startdate) return start;
        const end = new Date(enddate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return `${start} – ${end}`;
    };

    const formatTime = (startTime, endTime) => {
        if (!startTime || !endTime) return 'N/A';
        const fmt = (t) => {
            const [h, m] = t.split(':').map(Number);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const hour = h % 12 || 12;
            return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
        };
        return `${fmt(startTime)} - ${fmt(endTime)}`;
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>{error}</div>;
    }

    if (registrations.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <AlertCircle size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.5rem' }}>
                    No Active Registrations
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    You haven't registered for any upcoming events yet.
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {registrations.map(({ event, registrationStatus }) => (
                <div
                    key={event._id}
                    style={{
                        border: '2px solid #3b82f6',
                        borderRadius: '0.75rem',
                        padding: '1.25rem',
                        background: '#eff6ff'
                    }}
                >
                    {/* Event name + status badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                            {event.eventName}
                        </h3>
                        <span style={{
                            fontSize: '0.75rem',
                            background: registrationStatus === 'approved' ? '#d1fae5' : '#fef3c7',
                            color: registrationStatus === 'approved' ? '#065f46' : '#92400e',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                        }}>
                            {registrationStatus}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                            <Calendar size={16} />
                            <span>{formatDate(event.startdate, event.enddate)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                            <Clock size={16} />
                            <span>{formatTime(event.startTime, event.endTime)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                            <MapPin size={16} />
                            <span>{event.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                            <Building2 size={16} />
                            <span>{event.organizerId?.name || 'Unknown Organization'}</span>
                        </div>
                    </div>

                    {event.category && (
                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Category:</span>
                            <span style={{
                                fontSize: '0.75rem',
                                background: '#dbeafe',
                                color: '#1d4ed8',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '9999px',
                                fontWeight: '500',
                                textTransform: 'capitalize'
                            }}>
                                {event.category}
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ActiveRegistrationModal;
