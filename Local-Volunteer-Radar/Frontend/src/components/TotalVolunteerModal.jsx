import React from 'react';
import { User, MapPin, Calendar, Award } from 'lucide-react';

const TotalVolunteersModal = ({ volunteers }) => {
    const data = volunteers && volunteers.length > 0 ? volunteers : [];

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
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Total Volunteers</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>{data.length}</p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Total Hours</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                        {data.reduce((sum, v) => sum + v.hoursContributed, 0)}
                    </p>
                </div>
            </div>

            {/* Volunteers List */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Registered Volunteers
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                {data.map((volunteer) => (
                    <div
                        key={volunteer.id}
                        style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.75rem',
                            padding: '1.25rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.borderColor = '#3b82f6';
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
                                background: volunteer.profilePicture ? 'transparent' : getAvatarColor(volunteer.name || 'User'),
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                overflow: 'hidden',
                                objectFit: 'cover',
                                color: 'white'
                            }}>
                                {volunteer.profilePicture ? (
                                    <img src={volunteer.profilePicture} alt={volunteer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{getInitials(volunteer.name || 'User')}</span>
                                )}
                            </div>

                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.25rem 0' }}>
                                    {volunteer.name}
                                </h4>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                                    {volunteer.email}
                                </p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}>
                                        <MapPin size={14} />
                                        <span>{volunteer.location}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}>
                                        <Calendar size={14} />
                                        <span>Joined {volunteer.joinedDate}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                                        <strong style={{ color: '#3b82f6' }}>{volunteer.eventsCompleted}</strong> events
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                                        <strong style={{ color: '#10b981' }}>{volunteer.hoursContributed}</strong> hours
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {volunteer.skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.5rem',
                                                background: '#f3f4f6',
                                                color: '#4b5563',
                                                borderRadius: '0.25rem'
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TotalVolunteersModal;