import React, { useState } from 'react';
import { Megaphone, X, Send } from 'lucide-react';

const AnnouncementPopup = ({ isOpen, onClose }) => {
    const [announcements] = useState([
        {
            id: 1,
            title: 'Relief Distribution',
            message: 'Volunteer capacity increased to 10',
            timestamp: 'Dec 23, 06:34 PM'
        }
    ]);

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        message: ''
    });

    const handleInputChange = (e) => {
        setNewAnnouncement({
            ...newAnnouncement,
            [e.target.name]: e.target.value
        });
    };

    const handleSendAnnouncement = () => {
        if (newAnnouncement.title && newAnnouncement.message) {
            // Add to announcements list or send to backend
            console.log('New announcement:', newAnnouncement);
            setNewAnnouncement({ title: '', message: '' });
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
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
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                borderRadius: '1rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            background: 'linear-gradient(131.73deg, #0067DD 5.55%, #00AD4B 71.83%)',
                            borderRadius: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Megaphone size={20} color="white" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>Announcements</h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '50%',
                            width: '2.5rem',
                            height: '2.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e5e7eb'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Announcements List */}
                <div style={{ padding: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                    {announcements.map((announcement) => (
                        <div key={announcement.id} style={{
                            background: '#eff6ff',
                            border: '1px solid #dbeafe',
                            borderRadius: '0.75rem',
                            padding: '1.25rem',
                            marginBottom: '1rem'
                        }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e40af', marginBottom: '0.5rem' }}>
                                {announcement.title}
                            </h3>
                            <p style={{ color: '#1e3a8a', marginBottom: '0.75rem' }}>{announcement.message}</p>
                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{announcement.timestamp}</p>
                        </div>
                    ))}
                </div>

                {/* Send New Announcement */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid #e5e7eb',
                    background: '#f8fafc'
                }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Send New Announcement</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            name="title"
                            placeholder="Announcement Title"
                            value={newAnnouncement.title}
                            onChange={handleInputChange}
                            style={{
                                padding: '0.75rem 1rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '1rem'
                            }}
                        />
                        <textarea
                            name="message"
                            placeholder="Announcement message..."
                            value={newAnnouncement.message}
                            onChange={handleInputChange}
                            rows={3}
                            style={{
                                padding: '0.75rem 1rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                        />
                        <button
                            onClick={handleSendAnnouncement}
                            disabled={!newAnnouncement.title || !newAnnouncement.message}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                background: newAnnouncement.title && newAnnouncement.message ? '#3b82f6' : '#9ca3af',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '500',
                                cursor: newAnnouncement.title && newAnnouncement.message ? 'pointer' : 'not-allowed'
                            }}
                        >
                            <Send size={20} />
                            Send Announcement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementPopup;