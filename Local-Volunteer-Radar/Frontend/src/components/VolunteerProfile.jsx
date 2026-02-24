import React from 'react';
import { ArrowLeft, LogOut, Edit, Mail, Phone, MapPin, Download, Calendar } from 'lucide-react';
import {useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { useEffect } from "react";
import { useState } from "react";

// ─── Custom Alert Popup ───────────────────────────────────────────────────────
const CustomAlert = ({ alert, onClose }) => {
    if (!alert) return null;

    const styles = {
        success: { color: '#16a34a', bg: '#f0fdf4', border: '#16a34a' },
        error:   { color: '#dc2626', bg: '#fef2f2', border: '#dc2626' },
        info:    { color: '#0067DD', bg: '#eff6ff', border: '#0067DD' },
    };
    const s = styles[alert.type] || styles.info;

    const Icon = () => {
        if (alert.type === 'success') return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><polyline points="9 12 11.5 14.5 15.5 9.5"/>
            </svg>
        );
        if (alert.type === 'error') return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
        );
        return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
        );
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
            <style>{`@keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.18)', padding: '1.75rem', maxWidth: '400px', width: '90%', border: `1.5px solid ${s.border}`, animation: 'popIn 0.18s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1.5rem' }}>
                    <div style={{ flexShrink: 0, background: s.bg, borderRadius: '50%', padding: '6px', display: 'flex' }}>
                        <Icon />
                    </div>
                    <div>
                        {alert.title && <p style={{ fontWeight: '700', fontSize: '1rem', color: '#111', margin: '0 0 0.3rem 0' }}>{alert.title}</p>}
                        <p style={{ fontSize: '0.9rem', color: '#374151', margin: 0, lineHeight: '1.5' }}>{alert.message}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '0.45rem 1.5rem', background: s.color, color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                        onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const VolunteerProfile = () => {
    const navigate = useNavigate();
    const [volunteer, setVolunteer] = useState(null);
    const [isCalendarConnected, setIsCalendarConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    // ─── Custom alert state ───────────────────────────────────────────────────
    const [alertState, setAlertState] = useState(null);

    const showAlert = (message, type = 'info', title = '', onClose = null) => {
        setAlertState({ message, type, title, onClose });
    };

    const handleAlertClose = () => {
        const cb = alertState?.onClose;
        setAlertState(null);
        if (cb) cb();
    };
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        const fetchUserProfile = async () => {
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

            if (!loggedInUser) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/profile/${loggedInUser.email}`);
                const data = await response.json();

                if (data.success) {
                    const authResponse = await fetch(`http://localhost:5000/auth/google-tokens/${loggedInUser.email}`);
                    const authData = await authResponse.json();

                    const hasGoogleAccess = !!(authData.googleAccessToken || authData.googleRefreshToken);
                    setIsCalendarConnected(hasGoogleAccess);

                    const updatedUser = {
                        ...data.user,
                        fullName: data.user.name,
                        googleAccessToken: authData.googleAccessToken || null,
                        googleRefreshToken: authData.googleRefreshToken || null
                    };

                    setVolunteer(updatedUser);

                    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();

        const params = new URLSearchParams(window.location.search);
        if (params.get('calendar') === 'connected') {
            setIsCalendarConnected(true);
            window.history.replaceState({}, '', '/volunteer-profile');
        }
    }, [navigate]);

    if (loading || !volunteer) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading profile...</p>
            </div>
        );
    }

    const handleBackToDashboard = () => {
        navigate('/volunteer-dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        navigate('/login');
    };

    const handleEditProfile = () => {
        navigate('/volunteer-edit-profile');
    };

    const handleDownloadBadge = async () => {
        const badge = document.getElementById('volunteer-badge');
        if (!badge) return;

        const canvas = await html2canvas(badge, {
            scale: 2,
            backgroundColor: '#ffffff'
        });

        const link = document.createElement('a');
        link.download = `${volunteer.id}-badge.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const qrPayload = JSON.stringify({
        type: 'VOLUNTEER_PROFILE',
        id: volunteer.id,
        name: volunteer.fullName,
        email: volunteer.email
    });

    const activeSkills = volunteer.skills
        ? Object.keys(volunteer.skills).filter(key => volunteer.skills[key])
        : [];

    const availability = volunteer.availability || [];

    const handleConnectCalendar = async () => {
        if (isCalendarConnected) {
            // Disconnect calendar
            try {
                const response = await fetch(`http://localhost:5000/auth/google/disconnect/${volunteer.email}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                if (data.success) {
                    setIsCalendarConnected(false);

                    // Update localStorage
                    const updatedUser = {
                        ...volunteer,
                        googleAccessToken: null,
                        googleRefreshToken: null
                    };
                    setVolunteer(updatedUser);
                    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

                    showAlert('Google Calendar disconnected successfully!', 'success', 'Calendar Disconnected');
                } else {
                    showAlert('Failed to disconnect calendar', 'error', 'Disconnect Failed');
                }
            } catch (error) {
                console.error('Error disconnecting calendar:', error);
                showAlert('Failed to disconnect calendar', 'error', 'Disconnect Failed');
            }
        } else {
            // Connect calendar - get auth URL
            try {
                const response = await fetch('http://localhost:5000/auth/google/auth-url');
                const data = await response.json();

                const width = 500;
                const height = 600;
                const left = window.screen.width / 2 - width / 2;
                const top = window.screen.height / 2 - height / 2;

                window.open(
                    `${data.url}&state=${encodeURIComponent(volunteer.email)}`,
                    'Google Calendar Authorization',
                    `width=${width},height=${height},left=${left},top=${top}`
                );

                // Listen for successful connection
                const messageHandler = async (event) => {
                    if (event.data === 'calendar-connected') {
                        // Re-fetch tokens to update state
                        const authResponse = await fetch(`http://localhost:5000/auth/google-tokens/${volunteer.email}`);
                        const authData = await authResponse.json();

                        const updatedUser = {
                            ...volunteer,
                            googleAccessToken: authData.googleAccessToken,
                            googleRefreshToken: authData.googleRefreshToken
                        };

                        setVolunteer(updatedUser);
                        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
                        setIsCalendarConnected(true);
                        showAlert('Google Calendar connected successfully!', 'success', 'Calendar Connected');

                        window.removeEventListener('message', messageHandler);
                    }
                };

                window.addEventListener('message', messageHandler);
            } catch (error) {
                console.error('Error getting auth URL:', error);
                showAlert('Failed to connect to Google Calendar', 'error', 'Connection Failed');
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)' }}>
            {/* Custom Alert Popup */}
            <CustomAlert alert={alertState} onClose={handleAlertClose} />

            {/* Navbar */}
            <nav style={{ background: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem' }}>
                                <img src={logo} alt="Logo" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>My Profile</h1>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Manage your volunteer information</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={handleBackToDashboard}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: '#374151', background: 'transparent', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <ArrowLeft size={20} />
                                <span>Back to Dashboard</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: '#374151', background: 'transparent', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
                {/* Edit Profile Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                    <button
                        onClick={handleEditProfile}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                    >
                        <Edit size={18} />
                        <span>Edit Profile</span>
                    </button>
                </div>

                {/* Two Column Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    <style>
                        {`
                            @media (min-width: 1024px) {
                                .profile-grid {
                                    grid-template-columns: 1fr 1fr !important;
                                }
                            }
                        `}
                    </style>
                    <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', alignItems: 'start' }}>
                        {/* Left Column - Profile Information */}
                        <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: '0 0 1.5rem 0' }}>
                                Profile Information
                            </h2>

                            {/* Profile Picture and Name */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                                <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', overflow: 'hidden' }}>
                                    {volunteer.profilePicture ? (
                                        <img src={volunteer.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    )}
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0' }}>
                                    {volunteer.fullName}
                                </h3>
                            </div>

                            {/* Contact Information */}
                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <Mail size={18} style={{ color: '#6b7280' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>{volunteer.email}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <Phone size={18} style={{ color: '#6b7280' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>{volunteer.phoneNumber || "Not provided"}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <MapPin size={18} style={{ color: '#6b7280' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>{volunteer.address || "Not provided"}</span>
                                </div>
                            </div>

                            {/* Bio Section */}
                            {volunteer.bio && (
                                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>About Me</h3>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5', margin: 0 }}>{volunteer.bio}</p>
                                </div>
                            )}

                            {/* Your Skills */}
                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>Your Skills</h3>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {activeSkills.map(skill => (
                                        <span key={skill} style={{ padding: '0.5rem 1rem', background: '#d1fae5', color: '#065f46', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Availability */}
                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 1rem 0' }}>Availability</h3>
                                {availability.length > 0 ? (
                                    availability.map(slot => (
                                        <p key={slot.id} style={{ fontSize: '0.875rem', color: '#4b5563', margin: '0 0 0.5rem 0' }}>
                                            {slot.day}: {slot.startTime} - {slot.endTime}
                                        </p>
                                    ))
                                ) : (
                                    <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>No availability set</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - QR Badge and Calendar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Volunteer Badge */}
                            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Your Volunteer Badge</h2>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>
                                    Use this QR code for quick event check-in
                                </p>

                                {/* QR Code Badge */}
                                <div
                                    id="volunteer-badge"
                                    style={{ background: 'linear-gradient(135deg, #ffffff, #f0fdfa)', borderRadius: '1.25rem', padding: '2rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)' }}
                                >
                                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f766e', margin: 0 }}>Volunteer Badge</h2>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Local Volunteer Radar</p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                        <div style={{ padding: '0.75rem', background: 'white', borderRadius: '0.75rem', border: '2px solid #14b8a6' }}>
                                            <QRCodeCanvas value={qrPayload} size={180} level="H" />
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>{volunteer.fullName}</p>
                                        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.25rem 0' }}>ID: {volunteer.id}</p>
                                        <p style={{ fontSize: '0.85rem', color: '#374151' }}>{volunteer.email}</p>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                                        {activeSkills.map(skill => (
                                            <span key={skill} style={{ background: '#ccfbf1', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleDownloadBadge}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'background 0.2s ease' }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = '#1558d6'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = '#1a73e8'; }}
                                >
                                    <Download size={18} />
                                    <span>Download Badge</span>
                                </button>
                            </div>

                            {/* Google Calendar Sync */}
                            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={20} style={{ color: '#3b82f6' }} />
                                        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Google Calendar Sync</h2>
                                    </div>
                                    <span style={{ padding: '0.25rem 0.75rem', background: isCalendarConnected ? '#dbeafe' : '#fee2e2', color: isCalendarConnected ? '#1e40af' : '#991b1b', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                                        {isCalendarConnected ? 'Connected' : 'Not Connected'}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>
                                    Automatically sync your availability from Google Calendar
                                </p>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: '0 0 0.75rem 0' }}>
                                        Benefits of connecting your Google Calendar:
                                    </p>
                                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                                        <li style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>Automatic availability updates</li>
                                        <li style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>Event reminders synced to your calendar</li>
                                        <li style={{ fontSize: '0.875rem', color: '#4b5563' }}>One-click event scheduling</li>
                                    </ul>
                                </div>

                                <button
                                    onClick={handleConnectCalendar}
                                    style={{ width: '100%', padding: '0.75rem', background: isCalendarConnected ? '#10b981' : '#3b82f6', color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', transition: 'background-color 0.2s' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = isCalendarConnected ? '#059669' : '#2563eb'}
                                    onMouseOut={(e) => e.currentTarget.style.background = isCalendarConnected ? '#10b981' : '#3b82f6'}
                                >
                                    {isCalendarConnected ? 'Disconnect Calendar' : 'Connect Google Calendar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerProfile;