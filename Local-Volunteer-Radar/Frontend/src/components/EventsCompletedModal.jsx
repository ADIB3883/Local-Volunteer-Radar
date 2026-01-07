import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const EventsCompletedModal = ({ events }) => {
    const sampleEvents = [
        {
            id: 1,
            name: 'Beach Cleanup Drive',
            date: 'Dec 15, 2024',
            hours: 4,
            location: 'Cox\'s Bazar Beach',
            organization: 'Clean Ocean Initiative'
        },
        {
            id: 2,
            name: 'Food Distribution',
            date: 'Dec 10, 2024',
            hours: 3,
            location: 'Mirpur Community Center',
            organization: 'Food For All'
        },
    ];

    const eventData = events || sampleEvents;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {eventData.map((event) => (
                <div
                    key={event.id}
                    style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.25rem',
                        transition: 'box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                        {event.name}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                            <Calendar size={16} />
                            <span>{event.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                            <Clock size={16} />
                            <span>{event.hours} hours contributed</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                            <MapPin size={16} />
                            <span>{event.location}</span>
                        </div>
                    </div>
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Organization: </span>
                        <span style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '500' }}>
                            {event.organization}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EventsCompletedModal;