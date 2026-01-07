import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

const HoursVolunteeredModal = ({ totalHours, breakdown }) => {
    const sampleBreakdown = [
        { month: 'December 2024', hours: 12 },
        { month: 'November 2024', hours: 15 },
        { month: 'October 2024', hours: 13 },
    ];

    const data = breakdown || sampleBreakdown;

    return (
        <div>
            {/* Summary Card */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    color: 'white',
                    marginBottom: '1.5rem'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <TrendingUp size={20} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Total Hours Contributed</span>
                </div>
                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{totalHours || 40}</p>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>Making a difference, one hour at a time</p>
            </div>

            {/* Monthly Breakdown */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Monthly Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Calendar size={20} color="#6b7280" />
                            <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>{item.month}</span>
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#10b981' }}>
                            {item.hours} hrs
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HoursVolunteeredModal;