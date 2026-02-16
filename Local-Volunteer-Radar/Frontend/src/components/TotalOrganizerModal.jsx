import React from 'react';
import { Building2, MapPin, Calendar, Award, CheckCircle } from 'lucide-react';

const TotalOrganizersModal = ({ organizers }) => {
    const data = organizers && organizers.length > 0 ? organizers : [];

    const getInitials = (name) => name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'UN';
    
    const getAvatarColor = (name) => {
        const colors = ['#f97316', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
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
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Total Organizers</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#06b6d4', margin: 0 }}>{data.length}</p>
                </div>
            </div>

            {/* Organizers List */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Registered Organizers
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
                        {organizer.status === 'verified' && (
                            <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                background: '#d1fae5',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                color: '#065f46',
                                fontWeight: '500'
                            }}>
                                <CheckCircle size={14} />
                                <span>Verified</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                background: organizer.profilePicture ? 'transparent' : getAvatarColor(organizer.name || 'User'),
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                overflow: 'hidden',
                                objectFit: 'cover',
                                color: 'white'
                            }}>
                                {organizer.profilePicture ? (
                                    <img src={organizer.profilePicture} alt={organizer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{getInitials(organizer.name || 'User')}</span>
                                )}
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
                                        <MapPin size={14} />
                                        <span>{organizer.location}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}>
                                        <Calendar size={14} />
                                        <span>Joined {organizer.joinedDate}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                                        <strong style={{ color: '#3b82f6' }}>{organizer.totalVolunteers}</strong> volunteers engaged
                                    </span>
                                </div>

                                <span
                                    style={{
                                        display: 'inline-block',
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.5rem',
                                        background: '#f3f4f6',
                                        color: '#4b5563',
                                        borderRadius: '0.25rem'
                                    }}
                                >
                                    {organizer.category}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TotalOrganizersModal;