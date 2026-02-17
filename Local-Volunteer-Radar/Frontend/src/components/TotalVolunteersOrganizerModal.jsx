import React from 'react';
import { Users, Calendar } from 'lucide-react';

const TotalVolunteersOrganizerModal = ({ events }) => {
    // Dashboard already fetches events scoped to the logged-in organizer,
    // so no organizerId filtering needed here.
    const totalVolunteers = events.reduce((sum, e) => sum + Number(e.volunteersRegistered || 0), 0);

    const eventsWithVolunteers = events.filter(e => (e.volunteersRegistered || 0) > 0);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div>
            {/* Summary Card */}
            <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                color: 'white',
                marginBottom: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Users size={20} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Total Volunteers Engaged</span>
                </div>
                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{totalVolunteers}</p>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>Across all your events</p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Events with Volunteers</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
                        {eventsWithVolunteers.length}
                    </p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Avg per Event</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                        {eventsWithVolunteers.length > 0
                            ? Math.round(totalVolunteers / eventsWithVolunteers.length)
                            : 0}
                    </p>
                </div>
            </div>

            {/* Events Breakdown */}
            {eventsWithVolunteers.length > 0 ? (
                <>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                        Volunteer Breakdown by Event
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
                        {eventsWithVolunteers
                            .sort((a, b) => (b.volunteersRegistered || 0) - (a.volunteersRegistered || 0))
                            .map((event) => (
                                <div
                                    key={event._id}
                                    style={{
                                        background: 'white',
                                        padding: '1rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                        e.currentTarget.style.borderColor = '#10b981';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.25rem 0' }}>
                                                {event.eventName}
                                            </h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                                                <Calendar size={12} />
                                                <span>{`${new Date(event.startdate).toLocaleDateString('en-GB')} - ${new Date(event.enddate).toLocaleDateString('en-GB')}`}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', marginLeft: '0.5rem' }}>
                                            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                                                {event.volunteersRegistered || 0}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                                                of {event.volunteersNeeded}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{
                                        background: '#e5e7eb',
                                        height: '0.375rem',
                                        borderRadius: '0.25rem',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            background: '#10b981',
                                            height: '100%',
                                            width: `${Math.min(((event.volunteersRegistered || 0) / event.volunteersNeeded) * 100, 100)}%`,
                                            borderRadius: '0.25rem',
                                            transition: 'width 0.3s'
                                        }} />
                                    </div>
                                </div>
                            ))}
                    </div>
                </>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#6b7280'
                }}>
                    <Users size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ fontSize: '1rem', fontWeight: '500', margin: 0 }}>
                        No volunteers yet
                    </p>
                    <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                        Volunteers will appear here once they register for your events
                    </p>
                </div>
            )}
        </div>
    );
};

export default TotalVolunteersOrganizerModal;