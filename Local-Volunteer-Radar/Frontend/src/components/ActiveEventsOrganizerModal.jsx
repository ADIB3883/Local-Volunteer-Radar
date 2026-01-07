import React from 'react';
import { Calendar, Clock, MapPin, Users, TrendingUp } from 'lucide-react';

const ActiveEventsOrganizerModal = ({ events }) => {
    const organizerId = "org_123";

    // Filter for active events by this organizer
    const activeEvents = events.filter(e =>
        e.organizerId === organizerId && e.status === 'active'
    );

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    return (
        <div>
            {/* Summary Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Active Events</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
                        {activeEvents.length}
                    </p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Total Spots</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                        {activeEvents.reduce((sum, e) => sum + Number(e.volunteersNeeded), 0)}
                    </p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Registered</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7', margin: 0 }}>
                        {activeEvents.reduce((sum, e) => sum + Number(e.volunteersRegistered || 0), 0)}
                    </p>
                </div>
            </div>

            {/* Events List */}
            {activeEvents.length > 0 ? (
                <>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                        Currently Recruiting
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {activeEvents.map((event) => (
                            <div
                                key={event.id}
                                style={{
                                    background: 'white',
                                    border: '2px solid #3b82f6',
                                    borderRadius: '0.75rem',
                                    padding: '1.25rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                                            {event.eventName}
                                        </h4>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '0.25rem 0.5rem',
                                            background: '#dbeafe',
                                            color: '#1e40af',
                                            borderRadius: '0.25rem',
                                            fontWeight: '500'
                                        }}>
                                            {event.category}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                                        <Calendar size={16} />
                                        <span>{formatDate(event.startdate)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                                        <Clock size={16} />
                                        <span>{event.startTime} - {event.endTime}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                                        <MapPin size={16} />
                                        <span>{event.location}</span>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: '#f9fafb',
                                    borderRadius: '0.5rem'
                                }}>
                                    <Users size={20} color="#6b7280" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            background: '#e5e7eb',
                                            height: '0.5rem',
                                            borderRadius: '0.25rem',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                background: '#3b82f6',
                                                height: '100%',
                                                width: `${(event.volunteersRegistered / event.volunteersNeeded) * 100}%`,
                                                borderRadius: '0.25rem',
                                                transition: 'width 0.3s'
                                            }} />
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>
                                        {event.volunteersRegistered}/{event.volunteersNeeded}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#6b7280'
                }}>
                    <Calendar size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ fontSize: '1.125rem', fontWeight: '500', margin: 0 }}>
                        No active events
                    </p>
                    <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                        Create a new event to start recruiting volunteers
                    </p>
                </div>
            )}
        </div>
    );
};

export default ActiveEventsOrganizerModal;