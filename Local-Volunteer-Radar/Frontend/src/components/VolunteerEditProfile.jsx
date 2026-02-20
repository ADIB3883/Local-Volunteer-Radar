import React, { useState } from 'react';
import { ArrowLeft, LogOut, Camera, X, Plus, CheckCircle, AlertCircle, Info } from 'lucide-react';
import {useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";

// ─── Custom Alert Component ───────────────────────────────────────────────────
const CustomAlert = ({ alert, onClose }) => {
    if (!alert) return null;

    const styles = {
        success: {
            icon: <CheckCircle size={24} color="#16a34a" />,
            borderColor: '#16a34a',
            bgColor: '#f0fdf4',
            titleColor: '#15803d',
        },
        error: {
            icon: <AlertCircle size={24} color="#dc2626" />,
            borderColor: '#dc2626',
            bgColor: '#fef2f2',
            titleColor: '#b91c1c',
        },
        info: {
            icon: <Info size={24} color="#2563eb" />,
            borderColor: '#2563eb',
            bgColor: '#eff6ff',
            titleColor: '#1d4ed8',
        },
    };

    const s = styles[alert.type] || styles.info;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                padding: '2rem',
                maxWidth: '400px',
                width: '90%',
                border: `1.5px solid ${s.borderColor}`,
                animation: 'popIn 0.18s ease'
            }}>
                <style>{`@keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1.5rem' }}>
                    <div style={{ flexShrink: 0, marginTop: '0.1rem' }}>{s.icon}</div>
                    <div>
                        {alert.title && (
                            <p style={{ fontWeight: '700', fontSize: '1rem', color: s.titleColor, margin: '0 0 0.35rem 0' }}>
                                {alert.title}
                            </p>
                        )}
                        <p style={{ fontSize: '0.9rem', color: '#374151', margin: 0, lineHeight: '1.5' }}>
                            {alert.message}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.5rem 1.5rem',
                            background: s.borderColor,
                            color: 'white',
                            border: 'none',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            transition: 'opacity 0.15s'
                        }}
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
const VolunteerEditProfile = () => {
    const navigate = useNavigate();

    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [phoneError, setPhoneError] = useState('');

    // ─── Custom alert state ───────────────────────────────────────────────────
    const [alertState, setAlertState] = useState(null);
    // alertState: { type: 'success'|'error'|'info', title: string, message: string, onClose?: fn }

    const showAlert = (message, type = 'info', title = '', onClose = null) => {
        setAlertState({ message, type, title, onClose });
    };

    const handleAlertClose = () => {
        const cb = alertState?.onClose;
        setAlertState(null);
        if (cb) cb();
    };
    // ─────────────────────────────────────────────────────────────────────────

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        bio: ''
    });

    const [skills, setSkills] = useState([]);
    const [availabilitySlots, setAvailabilitySlots] = useState([]);

    React.useEffect(() => {
        const fetchUserProfile = async () => {
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:5000/api/profile/${loggedInUser.email}`
                );
                const data = await response.json();

                if (data.success) {
                    const user = data.user;
                    setFormData({
                        fullName: user.name || user.fullName || '',
                        email: user.email || '',
                        phone: user.phoneNumber || '',
                        address: user.address || '',
                        bio: user.bio || ''
                    });
                    if (user.profilePicture) setProfilePicturePreview(user.profilePicture);
                    const activeSkills = user.skills
                        ? Object.keys(user.skills).filter(key => user.skills[key])
                        : [];
                    setSkills(activeSkills);
                    setAvailabilitySlots(user.availability || []);
                } else {
                    console.error('Failed to fetch profile:', data.message);
                    loadFromLocalStorage(loggedInUser);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                loadFromLocalStorage(loggedInUser);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const loadFromLocalStorage = (volunteer) => {
        setFormData({
            fullName: volunteer.fullName || volunteer.name || '',
            email: volunteer.email || '',
            phone: volunteer.phoneNumber || '',
            address: volunteer.address || '',
            bio: volunteer.bio || ''
        });
        if (volunteer.profilePicture) setProfilePicturePreview(volunteer.profilePicture);
        const activeSkills = volunteer.skills
            ? Object.keys(volunteer.skills).filter(key => volunteer.skills[key])
            : [];
        setSkills(activeSkills);
        setAvailabilitySlots(volunteer.availability || []);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const digitsOnly = value.replace(/\D/g, '');
        setFormData({ ...formData, phone: digitsOnly });
        if (digitsOnly.length === 0) {
            setPhoneError('');
        } else if (digitsOnly.length !== 11) {
            setPhoneError('Phone number must be exactly 11 digits');
        } else {
            setPhoneError('');
        }
    };

    const handleSlotChange = (id, field, value) => {
        setAvailabilitySlots(availabilitySlots.map(slot =>
            slot.id === id ? { ...slot, [field]: value } : slot
        ));
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const [newSkill, setNewSkill] = useState('');

    const addSkill = () => {
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill('');
        }
    };

    const addAvailabilitySlot = () => {
        setAvailabilitySlots([
            ...availabilitySlots,
            { id: Date.now(), day: 'Monday', startTime: '09:00 AM', endTime: '05:00 PM' }
        ]);
    };

    const removeAvailabilitySlot = (id) => {
        setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== id));
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setProfilePicture(file);
    //             setProfilePicturePreview(reader.result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show local preview immediately (good UX)
        const reader = new FileReader();
        reader.onloadend = () => setProfilePicturePreview(reader.result);
        reader.readAsDataURL(file);

        // Upload to Cloudinary via your backend
        try {
            const formData = new FormData();
            formData.append('profilePicture', file);

            const response = await fetch('http://localhost:5000/api/profile/upload-picture', {
                method: 'POST',
                body: formData,  // Don't set Content-Type header — browser sets it with boundary
            });

            const data = await response.json();

            if (data.success) {
                // Store the Cloudinary URL instead of base64
                setProfilePicturePreview(data.imageUrl);
                console.log('Image uploaded successfully:', data.imageUrl);
            } else {
                showAlert('Failed to upload image. Please try again.', 'error', 'Upload Failed');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            showAlert('Error uploading image. Please try again.', 'error', 'Error');
        }
    };

    const handleSave = async () => {
        if (formData.phone && formData.phone.length !== 11) {
            showAlert('Phone number must be exactly 11 digits', 'error', 'Invalid Phone Number');
            return;
        }

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            showAlert('Please log in again', 'error', 'Session Expired', () => navigate('/login'));
            return;
        }

        setSaving(true);

        try {
            const updateData = {
                phoneNumber: formData.phone,
                address: formData.address,
                bio: formData.bio,
                skills: skills.reduce((acc, skill) => ({ ...acc, [skill]: true }), {}),
                availability: availabilitySlots,
                profilePicture: profilePicturePreview || ''
            };

            const response = await fetch(`http://localhost:5000/api/profile/${loggedInUser.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    //'user-data': JSON.stringify(loggedInUser)
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (data.success) {
                const updatedUser = {
                    ...loggedInUser,
                    name: data.user.name,
                    phoneNumber: data.user.phoneNumber,
                    address: data.user.address,
                    bio: data.user.bio,
                    skills: data.user.skills,
                    availability: data.user.availability,
                    profilePicture: data.user.profilePicture
                };
                localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
                showAlert('Your profile has been updated successfully!', 'success', 'Profile Updated', () => navigate('/volunteer-profile'));
            } else {
                showAlert('Failed to update profile: ' + data.message, 'error', 'Update Failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showAlert('Error updating profile. Please try again.', 'error', 'Error');
        } finally {
            setSaving(false);
        }
    };

    const handleBackToProfile = () => navigate('/volunteer-profile');

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)' }}>

            {/* Custom Alert Popup */}
            <CustomAlert alert={alertState} onClose={handleAlertClose} />

            {/* Header/Navbar */}
            <nav style={{ background: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem' }}>
                                <img src={logo} alt="Logo" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Edit Profile</h1>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Update your volunteer information</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={handleBackToProfile}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: '#374151', background: 'transparent', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <ArrowLeft size={20} />
                                <span>Back to Profile</span>
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
            <div style={{ maxWidth: '60rem', margin: '0 auto', padding: '2rem 1rem' }}>

                {/* Basic Information Section */}
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>Basic Information</h2>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 2rem 0' }}>Update your personal details</p>

                    {/* Profile Picture */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Profile Picture</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {profilePicturePreview ? (
                                    <img src={profilePicturePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <input type="file" id="profile-picture-upload" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            <button
                                onClick={() => document.getElementById('profile-picture-upload').click()}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                            >
                                <Camera size={18} />
                                <span>Upload Photo</span>
                            </button>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled
                               style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', background: '#f9fafb', color: '#6b7280', outline: 'none' }} />
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Name cannot be changed</p>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled
                               style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', background: '#f9fafb', color: '#6b7280', outline: 'none' }} />
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Email cannot be changed</p>
                    </div>

                    {/* Phone */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Phone Number <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="tel" name="phone" value={formData.phone} onChange={handlePhoneChange}
                            placeholder="01XXXXXXXXX" maxLength={11}
                            style={{ width: '100%', padding: '0.75rem', border: `1px solid ${phoneError ? '#ef4444' : '#e5e7eb'}`, borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.2s' }}
                            onFocus={(e) => { if (!phoneError) e.currentTarget.style.borderColor = '#3b82f6'; }}
                            onBlur={(e) => { if (!phoneError) e.currentTarget.style.borderColor = '#e5e7eb'; }}
                        />
                        {phoneError ? (
                            <p style={{ fontSize: '0.75rem', color: '#ef4444', margin: '0.25rem 0 0 0' }}>{phoneError}</p>
                        ) : (
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Enter 11-digit phone number (e.g., 01712345678)</p>
                        )}
                    </div>

                    {/* Address */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                               style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.2s' }}
                               onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                               onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'} />
                    </div>

                    {/* Bio */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleInputChange}
                                  placeholder="Tell us about yourself and why you want to volunteer..." rows={4}
                                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.2s', resize: 'vertical', fontFamily: 'inherit' }}
                                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'} />
                    </div>
                </div>

                {/* Skills Section */}
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>Skills & Expertise</h2>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>Select the skills you can offer as a volunteer</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                        {skills.map((skill, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500' }}>
                                <span>{skill}</span>
                                <button onClick={() => removeSkill(skill)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <select value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                                style={{ padding: '0.5rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', outline: 'none', background: 'white', flex: 0.25 }}>
                            <option value="">Select skill</option>
                            <option value="firstAid">firstAid</option>
                            <option value="mediaPhotography">mediaPhotography</option>
                            <option value="technicalSupport">technicalSupport</option>
                            <option value="animalRescue">animalRescue</option>
                            <option value="distribution">distribution</option>
                            <option value="eventLogistics">eventLogistics</option>
                            <option value="other">other</option>
                        </select>
                        <button onClick={addSkill}
                                style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                            Add
                        </button>
                    </div>
                </div>

                {/* Availability Section */}
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>Availability Schedule</h2>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>Set your regular volunteer availability</p>
                    {availabilitySlots.map((slot) => (
                        <div key={slot.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <select value={slot.day} onChange={(e) => handleSlotChange(slot.id, 'day', e.target.value)}
                                    style={{ flex: '1', minWidth: '150px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', outline: 'none' }}>
                                <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
                                <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                            </select>
                            <input type="text" value={slot.startTime} onChange={(e) => handleSlotChange(slot.id, 'startTime', e.target.value)} placeholder="09:00 AM"
                                   style={{ flex: '1', minWidth: '120px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }} />
                            <input type="text" value={slot.endTime} onChange={(e) => handleSlotChange(slot.id, 'endTime', e.target.value)} placeholder="05:00 PM"
                                   style={{ flex: '1', minWidth: '120px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }} />
                            <button onClick={() => removeAvailabilitySlot(slot.id)}
                                    style={{ padding: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}>
                                <X size={20} />
                            </button>
                        </div>
                    ))}
                    <button onClick={addAvailabilitySlot}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s', width: '100%', justifyContent: 'center' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                        <Plus size={18} />
                        <span>Add Availability Slot</span>
                    </button>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={handleBackToProfile}
                            style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', transition: 'all 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving || phoneError}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: (saving || phoneError) ? '#9ca3af' : '#3b82f6', color: 'white', border: 'none', borderRadius: '9999px', cursor: (saving || phoneError) ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: '600', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            onMouseOver={(e) => { if (!saving && !phoneError) e.currentTarget.style.background = '#2563eb'; }}
                            onMouseOut={(e) => { if (!saving && !phoneError) e.currentTarget.style.background = '#3b82f6'; }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VolunteerEditProfile;