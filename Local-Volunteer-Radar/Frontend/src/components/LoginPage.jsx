import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

import volunteerIcon from '../assets/icons/volunteer-icon.png';
import organizerIcon from '../assets/icons/organizer-icon.png';
import adminIcon from '../assets/icons/admin-icon.png';
import logoImage from '../assets/icons/logo.png';
import showPasswordIcon from '../assets/icons/show-password.png';
import hidePasswordIcon from '../assets/icons/hide-password.png';

const LoginPage = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [userType, setUserType] = useState('volunteer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

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
        },
        {
            type: 'admin',
            label: 'Admin',
            icon: adminIcon
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', { userType, email, password });

        if (userType === 'volunteer') {
            navigate('/volunteer-dashboard');
        } else if (userType === 'organizer') {
            navigate('/organizer-dashboard');
        } else if (userType === 'admin') {
            navigate('/admin-dashboard');
        }
    };

    const handleUserTypeClick = (type) => {
        setUserType(type);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="LOGINheader">
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
                        className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
                        onClick={() => navigate('/signup')}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="welcome">
                    <h2>Welcome back!</h2>
                    <p>Sign in to continue your journey</p>
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
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2"/>
                                <path d="M3 7l9 6 9-6" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                                data-tooltip={showPassword ? "Hide password" : "Show password"}
                            >
                                <img
                                    src={showPassword ? hidePasswordIcon : showPasswordIcon}
                                    alt="Toggle password visibility"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="forgot-password">
                        <a href="#">Forgot Password?</a>
                    </div>

                    <button type="submit" className="submit-btn">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;