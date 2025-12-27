import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUpPage.css';

import logoImage from '../assets/icons/logo.png';
import volunteerIcon from '../assets/icons/volunteer-icon.png';
import organizerIcon from '../assets/icons/organizer-icon.png';
import userIcon from '../assets/icons/user-icon.png';
import mailIcon from '../assets/icons/mail-icon.png';
import phoneIcon from '../assets/icons/phone-icon.png';
import passwordIcon from '../assets/icons/password-icon.png';
import addressIcon from '../assets/icons/address-icon.png';

const SignUp = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('volunteer');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        skills: []
    });

    const userTypeButtons = [
        {
            type: 'volunteer',
            label: 'Volunteer',
            icon: volunteerIcon
        },
        {
            type: 'organizer',
            label: 'Organizer',
            icon: organizerIcon
        }
    ];

    const skillOptions = [
        'Teaching',
        'First Aid/Medical',
        'Media/Photography',
        'Technical Support',
        'Tutoring',
        'Distribution',
        'Event Logistics',
        'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillToggle = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('SignUp attempt:', { userType, ...formData });

        navigate('/login');
    };

    const handleUserTypeClick = (type) => {
        setUserType(type);
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                {/* Logo and Title */}
                <div className="header">
                    <div className="logo">
                        <img src={logoImage} alt="Local Volunteer Radar Logo" />
                    </div>
                    <h1 className="title">
                        <span className="title-local">Local Volunteer</span>
                        <span className="title-radar"> Radar</span>
                    </h1>
                </div>

                <div className="tabs">
                    <button
                        className="tab"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                    <button className="tab active">
                        Sign Up
                    </button>
                </div>

                <div className="welcome">
                    <h2>Join us today!</h2>
                    <p>Create an account to get started</p>
                </div>

                <div className="user-type-section">
                    <label className="user-type-label">I am a...</label>
                    <div className="user-type-buttons">
                        {userTypeButtons.map((button) => (
                            <button
                                key={button.type}
                                className={`user-type-btn ${userType === button.type ? 'active' : ''}`}
                                onClick={() => handleUserTypeClick(button.type)}
                                data-type={button.type}
                                type="button"
                            >
                                <img
                                    src={button.icon}
                                    alt={`${button.label} icon`}
                                    className="user-type-icon"
                                />
                                {button.label}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Name</label>
                        <div className="input-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                            </svg>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2"/>
                                <path d="M3 7l9 6 9-6" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <div className="input-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                    </div>

                    {userType === 'volunteer' && (
                        <div className="form-group">
                            <label className="skills-label">Your Skills</label>
                            <div className="skills-grid">
                                {skillOptions.map((skill) => (
                                    <label key={skill} className="skill-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={formData.skills.includes(skill)}
                                            onChange={() => handleSkillToggle(skill)}
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span className="skill-text">{skill}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <div className="input-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter your address"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;