import React from 'react';
import { X, Clock, MapPin, Calendar, Users, HandFist, Building, Dumbbell } from 'lucide-react';

const StatDetailPopup = ({ stat, isOpen, onClose }) => {
    if (!isOpen || !stat) return null;

    // Convert Tailwind colors to proper hex
    const getColorWithOpacity = (color, opacity) => {
        const colors = {
            '3b82f6': '0,130,246',   // blue-500
            '10b981': '16,185,129',  // emerald-500
            '06b6d4': '6,182,212',   // cyan-500
            'a855f7': '168,85,247'   // violet-500
        };
        const rgb = colors[color.replace('#', '')] || '59,130,246';
        return `rgba(${rgb},${opacity})`;
    };

    const detailItems = [
        { label: 'Trend', value: stat.trend || '+12%', icon: Clock },
        { label: 'Location', value: stat.location || 'Nationwide', icon: MapPin },
        { label: 'Period', value: stat.period || 'Last 30 days', icon: Calendar },
        { label: 'Growth', value: stat.growth || '+8.5%', icon: Clock }
    ];

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '1rem',
                    maxWidth: '450px',
                    width: '100%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    position: 'relative',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    borderLeft: `4px solid ${stat.iconColor}`,
                    border: `1px solid ${stat.iconColor}`
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    backgroundColor: getColorWithOpacity(stat.iconColor, 0.1),
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: stat.iconColor
                    }}>
                        {stat.title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: '#f3f4f6',
                            border: `1px solid ${stat.iconColor}`,
                            borderRadius: '0.5rem',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={20} style={{ color: stat.iconColor }} />
                    </button>
                </div>

                {/* Main Stat */}
                <div style={{ padding: '2rem 1.5rem' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1.5rem',
                        padding: '1.5rem',
                        backgroundColor: getColorWithOpacity(stat.iconColor, 0.05),
                        borderRadius: '0.75rem',
                        borderLeft: `3px solid ${stat.iconColor}`
                    }}>
                        <h3 style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#4b5563',
                            margin: 0
                        }}>
                            {stat.subtitle}
                        </h3>
                        <div style={{
                            backgroundColor: stat.iconBg,
                            padding: '0.75rem',
                            borderRadius: '0.75rem',
                            border: `1px solid ${stat.iconColor}`
                        }}>
                            {stat.icon && <stat.icon size={24} style={{ color: stat.iconColor }} />}
                        </div>
                    </div>

                    <div style={{
                        textAlign: 'center',
                        padding: '2rem 1rem',
                        backgroundColor: getColorWithOpacity(stat.iconColor, 0.1),
                        borderRadius: '1rem',
                        border: `2px solid ${stat.iconColor}`
                    }}>
                        <p style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            color: stat.iconColor,
                            margin: 0
                        }}>
                            {stat.value}
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div style={{ padding: '0 1.5rem 2rem' }}>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {detailItems.map((item, index) => (
                            <div key={index} style={{
                                padding: '1.25rem',
                                backgroundColor: getColorWithOpacity(stat.iconColor, 0.05),
                                borderRadius: '0.75rem',
                                borderLeft: `3px solid ${stat.iconColor}`,
                                border: `1px solid ${stat.iconColor}`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            backgroundColor: stat.iconBg,
                                            padding: '0.5rem',
                                            borderRadius: '0.5rem',
                                            border: `1px solid ${stat.iconColor}`
                                        }}>
                                            <item.icon size={20} style={{ color: stat.iconColor }} />
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0, fontWeight: '500' }}>
                                            {item.label}
                                        </p>
                                    </div>
                                    <p style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold',
                                        color: stat.iconColor,
                                        margin: 0
                                    }}>
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatDetailPopup;
