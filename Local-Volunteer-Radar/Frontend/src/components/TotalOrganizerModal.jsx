import React from 'react';
import { Building2, Calendar } from 'lucide-react';

const TotalOrganizersModal = ({ organizers = [] }) => {
    // Use passed organizers data, fallback to empty array
    const data = organizers && organizers.length > 0 ? organizers : [];

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
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Total Organizers</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#06b6d4', margin: 0 }}>{data.length}</p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Verified</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                        {data.filter(o => o.status === 'verified').length}
                    </p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Total Events</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7', margin: 0 }}>
                        {data.reduce((sum, o) => sum + o.eventsCreated, 0)}
                    </p>
                </div>
            </div>

            {/* Organizers List */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Registered Organizations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                {data.map((organizer) => (
                    <div
                        key={organizer.id}
                        style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.75rem',
                            padding: '1.25rem',
                            transition: 'all 0.2s',
                            position: 'relative'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.borderColor = '#06b6d4';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                    >
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                background: '#cffafe',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Building2 size={24} color="#06b6d4" />
                            </div>

                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.25rem 0' }}>
                                    {organizer.name}
                                </h4>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                                    {organizer.email}
                                </p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}>
                                        <Calendar size={14} />
                                        <span>Joined {new Date(organizer.joinedDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                                        Type: <strong style={{ color: '#06b6d4' }}>{organizer.type}</strong>
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                                        Status: <strong style={{ color: organizer.isApproved ? '#10b981' : '#ef4444' }}>{organizer.isApproved ? 'Approved' : 'Pending'}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {data.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    <p>No organizers found</p>
                </div>
            )}
        </div>
    );
};

export default TotalOrganizersModal;