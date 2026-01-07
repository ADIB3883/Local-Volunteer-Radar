import React from 'react';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

const ActiveRegistrationModal = ({ registrations }) => {
    // Sample data - replace with actual data
    const sampleRegistrations = [
        {
            id: 1,
            name: 'Tree Planting Campaign',
            date: 'Jan 15, 2026',
            time: '8:00 AM - 12:00 PM',
            location: 'Ramna Park',
            organization: 'Green Earth Foundation'
        },
        {
            id: 2,
            name: 'Winter Clothes Donation',
            date: 'Jan 16, 2026',
            time: '8:00 PM - 11:00 PM',
            location: 'Shagufta',
            organization: 'Helping Hands NGO'
        },
    ];

    const data = registrations || sampleRegistrations;

    if (data.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <AlertCircle size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.5rem' }}>
                    No Active Registrations
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                    You haven't registered for any upcoming events yet.
                </p>
                <button
                    style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                    Browse Opportunities
                </button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.map((registration) => (
                <div
                    key={registration.id}
                    style={{
                        border: '2px solid #3b82f6',
                        borderRadius: '0.75rem',
                        padding: '1.25rem',
                        background: '#eff6ff'
                    }}
                >
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                        {registration.name}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                            <Calendar size={16} />
                            <span>{registration.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                            <Clock size={16} />
                            <span>{registration.time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                            <MapPin size={16} />
                            <span>{registration.location}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActiveRegistrationModal;