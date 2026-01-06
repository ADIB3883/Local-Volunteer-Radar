import React from 'react';
import { Award } from 'lucide-react';

const SkillsUtilizedModal = ({ skills }) => {
    // Sample data - replace with actual data
    const sampleSkills = [
        { name: 'Teaching & Education', hours: 25, events: 8 },
        { name: 'Community Outreach', hours: 15, events: 4 },
    ];

    const data = skills || sampleSkills;

    return (
        <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                Track the skills you've developed through your volunteer work
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.map((skill, index) => (
                    <div
                        key={index}
                        style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.75rem',
                            padding: '1.25rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.borderColor = '#a78bfa';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                            <div
                                style={{
                                    background: '#f3e8ff',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem'
                                }}
                            >
                                <Award size={24} color="#a78bfa" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                                    {skill.name}
                                </h3>
                                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                    <span><strong>{skill.hours}</strong> hours</span>
                                    <span><strong>{skill.events}</strong> events</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                }}
            >
                💡 Tip: Add more skills to your profile to get matched with relevant opportunities
            </div>
        </div>
    );
};

export default SkillsUtilizedModal;