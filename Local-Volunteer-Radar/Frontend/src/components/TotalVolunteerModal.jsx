import React from 'react';
import { User, MapPin, Calendar, Award } from 'lucide-react';

const TotalVolunteersModal = ({ volunteers }) => {
    // Sample data - replace with actual data
    const sampleVolunteers = [
        {
            id: 1,
            name: 'Sarah Ahmed',
            email: 'sarah.ahmed@email.com',
            location: 'Dhaka',
            joinedDate: 'Dec 1, 2024',
            eventsCompleted: 5,
            hoursContributed: 20,
            skills: ['Teaching', 'Community Outreach']
        },
        {
            id: 2,
            name: 'Karim Rahman',
            email: 'karim.r@email.com',
            location: 'Chittagong',
            joinedDate: 'Nov 15, 2024',
            eventsCompleted: 8,
            hoursContributed: 32,
            skills: ['First-Aid', 'Distribution']
        },
        {
            id: 3,
            name: 'Nadia Islam',
            email: 'nadia.islam@email.com',
            location: 'Dhaka',
            joinedDate: 'Nov 20, 2024',
            eventsCompleted: 3,
            hoursContributed: 12,
            skills: ['Education', 'Environment']
        },
        {
            id: 4,
            name: 'Fahim Hassan',
            email: 'fahim.h@email.com',
            location: 'Sylhet',
            joinedDate: 'Dec 5, 2024',
            eventsCompleted: 6,
            hoursContributed: 24,
            skills: ['Technology', 'Teaching']
        },
        {
            id: 5,
            name: 'Tasnim Chowdhury',
            email: 'tasnim.c@email.com',
            location: 'Dhaka',
            joinedDate: 'Oct 28, 2024',
            eventsCompleted: 10,
            hoursContributed: 40,
            skills: ['Community Outreach', 'Distribution']
        },
    ];

    const data = volunteers || sampleVolunteers;

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
                                background: '#dbeafe',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <User size={24} color="#3b82f6" />
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