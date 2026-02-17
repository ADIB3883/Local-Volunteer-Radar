import React from 'react';
import { ArrowLeft, LogOut, Edit, Mail, Phone, MapPin, Download, Calendar } from 'lucide-react';
import {useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { useEffect } from "react";
import { useState } from "react";

const VolunteerProfile = () => {
    const navigate = useNavigate();
    const [volunteer, setVolunteer] = useState(null);
    const [isCalendarConnected, setIsCalendarConnected] = useState(false);
    const [loading, setLoading] = useState(true);

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
                    setVolunteer({
                        ...data.user,
                        fullName: data.user.name
                    });

                    // Check if calendar is connected
                    setIsCalendarConnected(!!data.user.googleAccessToken);

                    localStorage.setItem('loggedInUser', JSON.stringify({
                        ...data.user,
                        fullName: data.user.name
                    }));
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
        // Check for calendar connection callback
        const params = new URLSearchParams(window.location.search);
        if (params.get('calendar') === 'connected') {
            setIsCalendarConnected(true);
            // Clean URL
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
    //loggedInUser e skills gula boolean object e ase
    const activeSkills = volunteer.skills
        ? Object.keys(volunteer.skills).filter(key => volunteer.skills[key])
        : [];

    const availability = volunteer.availability || [];

// Add this function before the return statement in VolunteerProfile component
    const handleConnectCalendar = async () => {
        if (isCalendarConnected) {
            // Disconnect calendar
            try {
                const response = await fetch(`http://localhost:5000/api/profile/${volunteer.email}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        googleAccessToken: null,
                        googleRefreshToken: null
                    })
                });

                if (response.ok) {
                    setIsCalendarConnected(false);
                    alert('Google Calendar disconnected successfully!');
                }
            } catch (error) {
                console.error('Error disconnecting calendar:', error);
            }
        } else {
            // Connect calendar - get auth URL
            try {
                const response = await fetch('http://localhost:5000/auth/google/auth-url');
                const data = await response.json();

                // Open OAuth popup
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
                window.addEventListener('message', (event) => {
                    if (event.data === 'calendar-connected') {
                        setIsCalendarConnected(true);
                        alert('Google Calendar connected successfully!');
                    }
                });
            } catch (error) {
                console.error('Error getting auth URL:', error);
                alert('Failed to connect to Google Calendar');
            }
        }
    };


    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)' }}>
            {/* Navbar */}
            <nav style={{ background: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
                        {/* Left side - Logo and Title */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem' }}>
                                <img
                                    src={logo}
                                    alt="Logo"
                                    style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }}
                                />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                    My Profile
                                </h1>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                                    Manage your volunteer information
                                </p>
                            </div>
                        </div>

                        {/* Right side - Back and Logout */}
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
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            transition: 'background-color 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
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
                                        <img
                                            src={volunteer.profilePicture}
                                            alt="Profile"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
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
                                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                                        {volunteer.email}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <Phone size={18} style={{ color: '#6b7280' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                                        {volunteer.phoneNumber || "Not provided"}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <MapPin size={18} style={{ color: '#6b7280' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                                        {volunteer.address || "Not provided"}
                                    </span>
                                </div>
                            </div>

                            {/*BIO SECTION*/}
                            {volunteer.bio && (
                                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                                            About Me
                                        </h3>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5', margin: 0 }}>
                                        {volunteer.bio}
                                    </p>
                                </div>
                            )}

                            {/* Your Skills */}
                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                                        Your Skills
                                    </h3>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {activeSkills.map(skill => (
                                        <span
                                            key={skill}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#d1fae5',
                                                color: '#065f46',
                                                borderRadius: '9999px',
                                                fontSize: '0.875rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}

                                </div>
                            </div>

                            {/* Availability */}
                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 1rem 0' }}>
                                    Availability
                                </h3>
                                {availability.length > 0 ? (
                                    availability.map(slot => (
                                        <p key={slot.id} style={{ fontSize: '0.875rem', color: '#4b5563', margin: '0 0 0.5rem 0' }}>
                                            {slot.day}: {slot.startTime} - {slot.endTime}
                                        </p>
                                    ))
                                ) : (
                                    <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                                        No availability set
                                    </p>
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
                                    <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                                        Your Volunteer Badge
                                    </h2>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>
                                    Use this QR code for quick event check-in
                                </p>

                                {/* QR Code */}
                                <div
                                    id="volunteer-badge"
                                    style={{
                                        background: 'linear-gradient(135deg, #ffffff, #f0fdfa)',
                                        borderRadius: '1.25rem',
                                        padding: '2rem',
                                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)'
                                    }}
                                >
                                    {/* Header */}
                                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f766e', margin: 0 }}>
                                            Volunteer Badge
                                        </h2>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            Local Volunteer Radar
                                        </p>
                                    </div>

                                    {/* QR Code */}
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                        <div
                                            style={{
                                                padding: '0.75rem',
                                                background: 'white',
                                                borderRadius: '0.75rem',
                                                border: '2px solid #14b8a6'
                                            }}
                                        >
                                            <QRCodeCanvas
                                                value={qrPayload}
                                                size={180}
                                                level="H"
                                            />
                                        </div>
                                    </div>

                                    {/* Volunteer Info */}
                                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                                            {volunteer.fullName}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.25rem 0' }}>
                                            ID: {volunteer.id}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: '#374151' }}>
                                            {volunteer.email}
                                        </p>
                                    </div>

                                    {/* Skills */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>

                                        {activeSkills.map(skill => (
                                            <span
                                                key={skill}
                                                style={{
                                                    background: '#ccfbf1',
                                                    color: '#065f46',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleDownloadBadge}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '9999px',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                        transition: 'background 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = '#1558d6';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = '#1a73e8';
                                    }}
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
                                        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                                            Google Calendar Sync
                                        </h2>
                                    </div>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        background: isCalendarConnected ? '#dbeafe' : '#fee2e2',
                                        color: isCalendarConnected ? '#1e40af' : '#991b1b',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {isCalendarConnected ? 'Connected' : 'Not Connected'}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>
                                    Automatically sync your availability from Google Calendar
                                </p>

                                {/* Benefits List */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: '0 0 0.75rem 0' }}>
                                        Benefits of connecting your Google Calendar:
                                    </p>
                                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                                        <li style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                                            Automatic availability updates
                                        </li>
                                        <li style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                                            Event reminders synced to your calendar
                                        </li>
                                        <li style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                                            One-click event scheduling
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    onClick={handleConnectCalendar}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: isCalendarConnected ? '#10b981' : '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '9999px',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        transition: 'background-color 0.2s'
                                    }}
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