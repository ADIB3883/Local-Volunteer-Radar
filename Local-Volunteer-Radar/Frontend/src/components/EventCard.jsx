import React from 'react';
import { Calendar, Clock, MapPin, Radio } from 'lucide-react';

const EventCard = ({
                       title,
                       description,
                       tags,
                       date,
                       time,
                       location,
                       distance,
                       requirements,
                       onRegister
                   }) => {
    return (
        <div
            style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
        >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>
                {title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: '0 0 1rem 0' }}>
                {description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            border: '1px solid',
                            color: tag.type === 'skill' ? '#0891b2' : '#4b5563',
                            background: tag.type === 'skill' ? '#cffafe' : '#f3f4f6',
                            borderColor: tag.type === 'skill' ? '#67e8f9' : '#d1d5db'
                        }}
                    >
                        {tag.name}
                    </span>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    <Calendar size={16} style={{ color: '#3b82f6' }} />
                    <span>{date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    <Clock size={16} style={{ color: '#10b981' }} />
                    <span>{time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    <MapPin size={16} style={{ color: '#ef4444' }} />
                    <span>{location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    <Radio size={16} style={{ color: '#a855f7' }} />
                    <span>{distance}</span>
                </div>
            </div>

            <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontWeight: '600' }}>Requirements:</span> {requirements}
            </div>

            <button
                onClick={onRegister}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'linear-gradient(to right, #3b82f6, #10b981)',
                    color: 'white',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #059669)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #3b82f6, #10b981)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
            >
                Register to Volunteer
            </button>
        </div>
    );
};

export default EventCard;