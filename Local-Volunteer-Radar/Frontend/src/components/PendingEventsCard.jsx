import { useState } from 'react';

export default function PendingEventsCard({ event }) {
    const [action, setAction] = useState(null);
    const badgeStyles = {
        Volunteer: {
            background: '#fef3c7',
            color: '#92400e',
        },
        NGO: {
            background: '#e9d5ff',
            color: '#6b21a8',
        }
    };

    return (
        <div
            style={{
                background: '#ffffff',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                padding: '1rem',
                maxHeight: '280px',
                minWidth: '100%'
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <strong>{event.title}</strong>
            </div>

            {/* Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {/* Left */}
                <div style={{ fontSize: '0.8rem' }}>
                    <p><strong>Date:</strong> {event.date}</p>
                    <p><strong>Time:</strong> {event.time}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p>
                        <strong>Submitted by:</strong> {event.submittedBy}{' '}
                        <span style={{ ...badgeStyles[event.orgType], fontSize: '0.65rem', background: '#e0e7ff', padding: '0.1rem 0.4rem', borderRadius: '0.4rem' }}>
                          {event.orgType}
                        </span>
                    </p>
                    <p><strong>Submitted on:</strong> {event.submittedOn}</p>
                </div>

                {/* Right */}
                <div>
                    <div
                        style={{
                            background: '#f8fafc',
                            padding: '0.75rem',
                            borderRadius: '0.6rem',
                            border: '1px solid #e5e7eb',
                            marginBottom: '0.75rem',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                            <span>Volunteers</span>
                            <strong>{event.volunteersFilled} / {event.volunteersNeeded}</strong>
                        </div>

                        <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '999px', marginTop: '0.5rem' }}>
                            <div
                                style={{
                                    width: `${(event.volunteersFilled / event.volunteersNeeded) * 100}%`,
                                    height: '100%',
                                    background: '#3b82f6',
                                    borderRadius: '999px',
                                }}
                            />
                        </div>

                        <p style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.3rem' }}>
                            {Math.round((event.volunteersFilled / event.volunteersNeeded) * 100)}% capacity filled
                        </p>
                    </div>

                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.6rem', padding: '0.6rem', fontSize: '0.75rem' }}>
                        <strong>Requirements</strong>
                        <p>{event.requirements}</p>
                    </div>
                </div>
            </div>

            {/* Approve / Reject */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                {(action === null || action === 'approve') && (
                    <button
                        onClick={() => setAction('approve')}
                        style={{
                            flex: action === 'approve' ? 2 : 1,
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #22c55e',
                            background: '#22c55e',
                            color: '#ffffff',
                            fontWeight: 600,
                            cursor: action ? 'default' : 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {action === 'approve' ? 'Approved!' : 'Approve'}
                    </button>
                )}

                {(action === null || action === 'reject') && (
                    <button
                        onClick={() => setAction('reject')}
                        style={{
                            flex: action === 'reject' ? 2 : 1,
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #ef4444',
                            background: '#ef4444',
                            color: '#ffffff',
                            fontWeight: 600,
                            cursor: action ? 'default' : 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {action === 'reject' ? 'Rejected!' : 'Reject'}
                    </button>
                )}
            </div>

        </div>
    );
}