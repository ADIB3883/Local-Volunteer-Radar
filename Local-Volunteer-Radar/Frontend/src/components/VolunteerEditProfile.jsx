import React, { useState } from 'react';
import { ArrowLeft, LogOut, Camera, X, Plus } from 'lucide-react';
import {useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";


const VolunteerEditProfile = () => {
    const navigate = useNavigate();

    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        bio: ''
    });

    const [skills, setSkills] = useState([]);
    const [availabilitySlots, setAvailabilitySlots] = useState([]);

    // ✅ MODIFIED: Fetch data from backend
    React.useEffect(() => {
        const fetchUserProfile = async () => {
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                navigate('/login');
                return;
            }

            try {
                // Fetch fresh data from backend
                const response = await fetch(`http://localhost:5000/api/auth/profile/${loggedInUser.id}`);
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

                    if (user.profilePicture) {
                        setProfilePicturePreview(user.profilePicture);
                    }

                    // Convert skills object to array
                    const activeSkills = user.skills
                        ? Object.keys(user.skills).filter(key => user.skills[key])
                        : [];
                    setSkills(activeSkills);

                    // Load availability
                    setAvailabilitySlots(user.availability || []);
                } else {
                    console.error('Failed to fetch profile:', data.message);
                    // Fallback to localStorage
                    loadFromLocalStorage(loggedInUser);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Fallback to localStorage
                loadFromLocalStorage(loggedInUser);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    // Helper function for localStorage fallback
    const loadFromLocalStorage = (volunteer) => {
        setFormData({
            fullName: volunteer.fullName || volunteer.name || '',
            email: volunteer.email || '',
            phone: volunteer.phoneNumber || '',
            address: volunteer.address || '',
            bio: volunteer.bio || ''
        });

        if (volunteer.profilePicture) {
            setProfilePicturePreview(volunteer.profilePicture);
        }

        const activeSkills = volunteer.skills
            ? Object.keys(volunteer.skills).filter(key => volunteer.skills[key])
            : [];
        setSkills(activeSkills);

        setAvailabilitySlots(volunteer.availability || []);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(file);
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Save to backend AND localStorage
    const handleSave = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            alert('Please log in again');
            navigate('/login');
            return;
        }

        setSaving(true);

        try {
            // Prepare data for backend
            const updateData = {
                phoneNumber: formData.phone,
                address: formData.address,
                bio: formData.bio,
                skills: skills.reduce((acc, skill) => ({ ...acc, [skill]: true }), {}),
                availability: availabilitySlots,
                profilePicture: profilePicturePreview || ''
            };

            // Send PUT request to backend
            const response = await fetch(`http://localhost:5000/api/profile/${loggedInUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (data.success) {
                // Update localStorage with fresh data from backend
                const updatedUser = {
                    ...loggedInUser,
                    ...data.user,
                    fullName: data.user.name || data.user.fullName
                };

                localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

                alert('Profile updated successfully!');

                navigate('/volunteer-profile');
            } else {
                alert('Failed to update profile: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleBackToProfile = () => {
        navigate('/volunteer-profile');
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        navigate('/login');
    };

    // ✅ ADD: Loading state
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)' }}>
            {/* Header/Navbar */}
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
                                    Edit Profile
                                </h1>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                                    Update your volunteer information
                                </p>
                            </div>
                        </div>

                        {/* Right side - Back and Logout */}
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
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>
                        Basic Information
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 2rem 0' }}>
                        Update your personal details
                    </p>

                    {/* Profile Picture */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Profile Picture
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {profilePicturePreview ? (
                                    <img
                                        src={profilePicturePreview}
                                        alt="Profile"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <input
                                type="file"
                                id="profile-picture-upload"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <button
                                onClick={() => document.getElementById('profile-picture-upload').click()}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    background: 'white',
                                    color: '#374151',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
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
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            disabled
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                background: '#f9fafb',
                                color: '#6b7280',
                                outline: 'none'
                            }}
                        />
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                            Name cannot be changed
                        </p>
                    </div>

                    {/* Email Address */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                background: '#f9fafb',
                                color: '#6b7280',
                                outline: 'none'
                            }}
                        />
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                            Email cannot be changed
                        </p>
                    </div>

                    {/* Phone Number */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    {/* Address */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself and why you want to volunteer..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                        />
                    </div>
                </div>

                {/* Skills & Expertise Section */}
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>
                        Skills & Expertise
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>
                        Select the skills you can offer as a volunteer
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    background: '#3b82f6',
                                    color: 'white',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}
                            >
                                <span>{skill}</span>
                                <button
                                    onClick={() => removeSkill(skill)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <select
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            style={{
                                padding: '0.5rem 1rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                outline: 'none',
                                background: 'white',
                                flex: 0.25
                                //minWidth: '180px'
                            }}
                        >
                            <option value="">Select skill</option>
                            <option value="firstAid">firstAid</option>
                            <option value="mediaPhotography">mediaPhotography</option>
                            <option value="technicalSupport">technicalSupport</option>
                            <option value="animalRescue">animalRescue</option>
                            <option value="distribution">distribution</option>
                            <option value="eventLogistics">eventLogistics</option>
                            <option value="other">other</option>
                        </select>

                        <button
                            onClick={addSkill}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Add
                        </button>
                    </div>

                </div>

                {/* Availability Schedule Section */}
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>
                        Availability Schedule
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem 0' }}>
                        Set your regular volunteer availability
                    </p>

                    {availabilitySlots.map((slot) => (
                        <div key={slot.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <select
                                value={slot.day}
                                onChange={(e) => handleSlotChange(slot.id, 'day', e.target.value)}
                                style={{
                                    flex: '1',
                                    minWidth: '150px',
                                    padding: '0.75rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                <option>Monday</option>
                                <option>Tuesday</option>
                                <option>Wednesday</option>
                                <option>Thursday</option>
                                <option>Friday</option>
                                <option>Saturday</option>
                                <option>Sunday</option>
                            </select>

                            <input
                                type="text"
                                value={slot.startTime}
                                onChange={(e) => handleSlotChange(slot.id, 'startTime', e.target.value)}
                                placeholder="09:00 AM"
                                style={{
                                    flex: '1',
                                    minWidth: '120px',
                                    padding: '0.75rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    outline: 'none'
                                }}
                            />

                            <input
                                type="text"
                                value={slot.endTime}
                                onChange={(e) => handleSlotChange(slot.id, 'endTime', e.target.value)}
                                placeholder="05:00 PM"
                                style={{
                                    flex: '1',
                                    minWidth: '120px',
                                    padding: '0.75rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    outline: 'none'
                                }}
                            />

                            <button
                                onClick={() => removeAvailabilitySlot(slot.id)}
                                style={{
                                    padding: '0.75rem',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={addAvailabilitySlot}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: 'white',
                            color: '#374151',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            width: '100%',
                            justifyContent: 'center'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                    >
                        <Plus size={18} />
                        <span>Add Availability Slot</span>
                    </button>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        onClick={handleBackToProfile}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'white',
                            color: '#374151',
                            border: '1px solid #e5e7eb',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: saving ? '#9ca3af' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '9999px',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            transition: 'background-color 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseOver={(e) => {
                            if (!saving) e.currentTarget.style.background = '#2563eb';
                        }}
                        onMouseOut={(e) => {
                            if (!saving) e.currentTarget.style.background = '#3b82f6';
                        }}
                    >
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