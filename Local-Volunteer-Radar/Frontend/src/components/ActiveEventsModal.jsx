import React from 'react';
import { Calendar, Clock, MapPin, Users, Building2, Loader2 } from 'lucide-react';

const ActiveEventsModal = ({ events }) => {
    const data = events && events.length > 0 ? events : [];

    if (!events) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem',
                color: '#6b7280'
            }}>
                <Loader2 size={32} className="animate-spin mb-4" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: '500' }}>Loading events...</p>
            </div>
        );
    }

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
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7', margin: 0 }}>{data && data.length > 0 ? data.length : 0}</p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Registered Volunteers</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
                        {data && data.length > 0 ? data.reduce((sum, e) => sum + (e.volunteersRegistered || 0), 0) : 0}
                    </p>
                </div>
            </div>

            {/* Events List */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Currently Active Events
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                {data.map((event) => (
                    <div
                        key={event.id}
                        style={{
                            background: 'white',
                            border: '2px solid #a855f7',
                            borderRadius: '0.75rem',
                            padding: '1.25rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(168, 85, 247, 0.3)';
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
                                    {event.name}
                                </h4>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    background: '#f3e8ff',
                                    color: '#7c3aed',
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
                                <span>{event.date}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                                <Clock size={16} />
                                <span>{event.time}</span>
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

                {data.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: '#6b7280'
                    }}>
                        <p style={{ fontSize: '1.125rem', fontWeight: '500', margin: 0 }}>
                            No active events at the moment
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveEventsModal;
