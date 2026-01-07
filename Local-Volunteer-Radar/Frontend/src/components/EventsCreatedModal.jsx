import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

const EventsCreatedModal = ({ events }) => {
    const organizerId = "org_123";

    const myEvents = events.filter(e => e.organizerId === organizerId);

    const activeEvents = myEvents.filter(e => e.status === 'active');
    const pendingEvents = myEvents.filter(e => e.status === 'pending');
    const completedEvents = myEvents.filter(e => e.status === 'completed');

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return { bg: '#dcfce7', text: '#166534', icon: '#10b981' };
            case 'pending': return { bg: '#fef3c7', text: '#92400e', icon: '#f59e0b' };
            case 'completed': return { bg: '#e0e7ff', text: '#3730a3', icon: '#6366f1' };
            default: return { bg: '#f3f4f6', text: '#374151', icon: '#6b7280' };
        }
    };

    return (
        <div>
            {/* Summary Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center',
                    border: '2px solid #10b981'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Total</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                        {myEvents.length}
                    </p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center',
                    border: '1px solid #e5e7eb'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Active</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
                        {activeEvents.length}
                    </p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center',
                    border: '1px solid #e5e7eb'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Pending</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
                        {pendingEvents.length}
                    </p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center',
                    border: '1px solid #e5e7eb'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Completed</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#6366f1', margin: 0 }}>
                        {completedEvents.length}
                    </p>
                </div>
            </div>

            {/* Events List */}
            {myEvents.length > 0 ? (
                <>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                        All Your Events
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {myEvents
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((event) => {
                                const statusColors = getStatusColor(event.status);
                                return (
                                    <div
                                        key={event.id}
                                        style={{
                                            background: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '0.75rem',
                                            padding: '1rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                            e.currentTarget.style.borderColor = statusColors.icon;
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
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                                                        <Calendar size={12} />
                                                        <span>{formatDate(event.startdate)}</span>
                                                    </div>
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        padding: '0.125rem 0.5rem',
                                                        background: '#f3f4f6',
                                                        color: '#4b5563',
                                                        borderRadius: '0.25rem'
                                                    }}>
                                                        {event.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.625rem',
                                                background: statusColors.bg,
                                                color: statusColors.text,
                                                borderRadius: '0.375rem',
                                                fontWeight: '500',
                                                textTransform: 'capitalize'
                                            }}>
                                                {event.status}
                                            </span>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '0.75rem',
                                            color: '#6b7280',
                                            paddingTop: '0.5rem',
                                            borderTop: '1px solid #f3f4f6'
                                        }}>
                                            <span>
                                                Volunteers: <strong style={{ color: '#4b5563' }}>
                                                    {event.volunteersRegistered}/{event.volunteersNeeded}
                                                </strong>
                                            </span>
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                );
                            })}
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
                        No events created yet
                    </p>
                    <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                        Start by creating your first volunteer event
                    </p>
                </div>
            )}
        </div>
    );
};

export default EventsCreatedModal;