import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, iconColor, iconBg }) => {
    return (
        <div
            style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s',
                borderLeft: `4px solid ${iconColor}`,
                cursor: 'default'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>
                    {title}
                </h3>
                <div style={{ background: iconBg, padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <Icon size={20} style={{ color: iconColor }} />
                </div>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    {value}
                </p>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                {subtitle}
            </p>
        </div>
    );
};

export default StatCard;