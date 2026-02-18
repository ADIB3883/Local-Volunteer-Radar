import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Building2 } from 'lucide-react';

const EventsCompletedModal = () => {
    const [completedEvents, setCompletedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCompletedEvents();
    }, []);

    const fetchCompletedEvents = async () => {
        try {
            setLoading(true);
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

            if (!loggedInUser?.email) {
                setError("User not found.");
                return;
            }

            const response = await fetch(
                `http://localhost:5000/api/events/volunteer/${loggedInUser.email}/registrations`
            );
            const data = await response.json();

            if (!data.success) {
                setError("Failed to fetch registrations.");
                return;
            }

            // Filter for approved registrations where the event is completed
            const completed = data.registrations.filter(
                (reg) =>
                    reg.registrationStatus === 'approved' &&
                    reg.event.status === 'completed'
            );

            setCompletedEvents(completed);
        } catch (err) {
            console.error("Error fetching completed events:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const calculateHours = (startTime, endTime, startdate, enddate) => {
        if (!startTime || !endTime || !startdate) return null;
        try {
            const [startH, startM] = startTime.split(':').map(Number);
            const [endH, endM] = endTime.split(':').map(Number);
            const dailyMinutes = (endH * 60 + endM) - (startH * 60 + startM);
            if (dailyMinutes <= 0) return null;

            const start = new Date(startdate);
            const end = new Date(enddate || startdate);
            const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

            const totalMinutes = dailyMinutes * days;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
        } catch {
            return null;
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <p>Loading completed events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
                <p>{error}</p>
            </div>
        );
    }

    if (completedEvents.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <p style={{ fontSize: '0.875rem' }}>No completed events yet.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {completedEvents.map(({ event, registeredAt }) => {
                const hours = calculateHours(event.startTime, event.endTime, event.startdate, event.enddate);
                const organizerName = event.organizerId?.name || 'Unknown Organization';

                return (
                    <div
                        key={event._id}
                        style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.75rem',
                            padding: '1.25rem',
                            transition: 'box-shadow 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                        {/* Event name + completed badge */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                                {event.eventName}
                            </h3>
                            <span style={{
                                fontSize: '0.75rem',
                                background: '#d1fae5',
                                color: '#065f46',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '9999px',
                                fontWeight: '600'
                            }}>
                                Completed
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                <Calendar size={16} />
                                <span>
                                    {formatDate(event.startdate)}
                                    {event.enddate && event.enddate !== event.startdate
                                        ? ` – ${formatDate(event.enddate)}`
                                        : ''}
                                </span>
                            </div>

                            {hours && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                    <Clock size={16} />
                                    <span>{hours} contributed</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                <MapPin size={16} />
                                <span>{event.location}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                <Building2 size={16} />
                                <span>{organizerName}</span>
                            </div>
                        </div>

                        {event.category && (
                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Category:</span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    background: '#eff6ff',
                                    color: '#3b82f6',
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
                );
            })}
        </div>
    );
};

export default EventsCompletedModal;
