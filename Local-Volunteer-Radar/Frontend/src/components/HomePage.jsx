import React from 'react';
import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';
import HomeButton from "./HomeButton.jsx";
import volunteerImage from '../assets/Volunteer.jpg';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="copa-homepage">
            {/* Header */}
            <header className="copa-header">
                <div className="copa-header-container">
                    <HomeButton/>
                    <div className="copa-header-actions">
                        <button className="copa-btn-primary" onClick={() => navigate('/login')}>Get Started</button>
                    </div>
                </div>
            </header>

            {/* Main Content Wrapper */}
            <main className="copa-main-content">
                {/* Hero Section */}
                <section className="copa-hero-section">
                    <h1 className="copa-hero-title">
                        Connect with <span className="highlight1">Volunteer</span> <span className="highlight2">Opportunities</span> Near You
                    </h1>
                    <p className="copa-hero-description">
                        Connect with local volunteer opportunities and join a community of change makers
                        dedicated to build a better tomorrow.
                    </p>
                    <div className="copa-hero-buttons">
                        <button
                            className="copa-btn-hero-primary"
                            onClick={() => navigate('/login', { state: { view: 'signup', userType: 'volunteer' } })}
                        >
                            Join as Volunteer
                        </button>
                        <button
                            className="copa-btn-hero-secondary"
                            onClick={() => navigate('/login', { state: { view: 'signup', userType: 'organizer' } })}
                        >
                            Register Organization
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="copa-features-section">
                    <div className="copa-features-header">
                        <h2 className="copa-features-title">Everything you need to volunteer effectively</h2>
                        <p className="copa-features-description">
                            Powerful features designed to help you find, participate, and track your volunteer
                            journey with ease.
                        </p>
                    </div>

                    <div className="copa-features-grid">
                        {/* Feature 1 */}
                        <div className="copa-feature-card">
                            <div className="copa-feature-icon blue">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <h3 className="copa-feature-title">Find Local Opportunities</h3>
                            <p className="copa-feature-description">
                                Discover volunteer opportunities in your area based on your interests and availability.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="copa-feature-card">
                            <div className="copa-feature-icon teal">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h3 className="copa-feature-title">Connect with Community</h3>
                            <p className="copa-feature-description">
                                Join a network of passionate volunteers and organizations making real impact.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="copa-feature-card">
                            <div className="copa-feature-icon green">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <h3 className="copa-feature-title">Flexible Scheduling</h3>
                            <p className="copa-feature-description">
                                Manage your volunteer commitments with easy scheduling and calendar integration.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="copa-feature-card">
                            <div className="copa-feature-icon purple">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                    <polyline points="17 6 23 6 23 12"></polyline>
                                </svg>
                            </div>
                            <h3 className="copa-feature-title">Growth Analytics</h3>
                            <p className="copa-feature-description">
                                Track your volunteer hours and see the impact you're making in your community.
                            </p>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="copa-about-section">
                    <div className="copa-about-container">
                        <div className="copa-about-content">
                            <h2 className="copa-about-title">Building Stronger Communities Together</h2>
                            <p className="copa-about-text">
                                Local Volunteer Radar was founded on the belief that everyone has something valuable
                                to offer their community. We connect passionate individuals with meaningful
                                opportunities to make a real difference.
                            </p>
                            <p className="copa-about-text">
                                Our platform simplifies the volunteer experience, making it easier than ever to
                                discover causes you care about, connect with like-minded people, and track your
                                positive impact on the world around you.
                            </p>
                        </div>
                        <div className="copa-about-image">
                            <img src={volunteerImage} alt="Volunteer helping community"/>
                        </div>
                    </div>
                </section>

                {/* Impact Section */}
                <section className="copa-impact-section">
                    <div className="copa-impact-overlay">
                        <h2 className="copa-impact-title">Our Impact by the Numbers</h2>
                        <p className="copa-impact-subtitle">Together, we're making a real difference in communities across the country.</p>
                        <div className="copa-stats-grid">
                            <div className="copa-stat-item">
                                <div className="copa-stat-number">100+</div>
                                <div className="copa-stat-label">Active Volunteers</div>
                            </div>
                            <div className="copa-stat-item">
                                <div className="copa-stat-number">1,000+</div>
                                <div className="copa-stat-label">Hours Volunteered</div>
                            </div>
                            <div className="copa-stat-item">
                                <div className="copa-stat-number">50+</div>
                                <div className="copa-stat-label">Cities Covered</div>
                            </div>
                            <div className="copa-stat-item">
                                <div className="copa-stat-number">40+</div>
                                <div className="copa-stat-label">Partner Organizations</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="copa-contact-section">
                    <h2 className="copa-contact-title">Get in <span className="copa-highlight">Touch</span></h2>
                    <p className="copa-contact-subtitle">
                        We're here to help you make a difference in your community. Reach out to us anytime.
                    </p>
                    <div className="copa-contact-grid">
                        <div className="copa-contact-card">
                            <div className="copa-contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <div className="copa-contact-info">
                                <div className="copa-contact-label">Address</div>
                                <div className="copa-contact-value">Mirpur DOHS, Mirpur, Dhaka</div>
                            </div>
                        </div>

                        <div className="copa-contact-card">
                            <div className="copa-contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                            </div>
                            <div className="copa-contact-info">
                                <div className="copa-contact-label">Phone</div>
                                <div className="copa-contact-value">01310043083</div>
                            </div>
                        </div>

                        <div className="copa-contact-card">
                            <div className="copa-contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                            <div className="copa-contact-info">
                                <div className="copa-contact-label">Email</div>
                                <div className="copa-contact-value">hellohero55@gmail.com</div>
                            </div>
                        </div>

                        <div className="copa-contact-card">
                            <div className="copa-contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <div className="copa-contact-info">
                                <div className="copa-contact-label">Working Hours</div>
                                <div className="copa-contact-value">Sun - Thurs: 8:00 AM-7:00 PM</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="copa-testimonials-section">
                    <h2 className="copa-testimonials-title">Testimonials</h2>
                    <p className="copa-testimonials-subtitle">What our community members are saying</p>

                    <div className="copa-testimonials-grid">
                        {/* Testimonial 1 */}
                        <div className="copa-testimonial-card">
                            <div className="copa-testimonial-header">
                                <div className="copa-testimonial-avatar">
                                    <img src="https://i.pravatar.cc/150?img=12" alt="Adib Hoque" />
                                </div>
                                <div className="copa-testimonial-info">
                                    <div className="copa-testimonial-name">Adib Hoque</div>
                                    <div className="copa-testimonial-role">Volunteer</div>
                                </div>
                            </div>
                            <p className="copa-testimonial-text">
                                This platform simplifies everything, making volunteer work more accessible and fulfilling.
                            </p>
                            <div className="copa-testimonial-rating">★★★★★</div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="copa-testimonial-card">
                            <div className="copa-testimonial-header">
                                <div className="copa-testimonial-avatar">
                                    <img src="https://i.pravatar.cc/150?img=33" alt="Shihab Ahmed" />
                                </div>
                                <div className="copa-testimonial-info">
                                    <div className="copa-testimonial-name">Shihab Ahmed</div>
                                    <div className="copa-testimonial-role">Volunteer</div>
                                </div>
                            </div>
                            <p className="copa-testimonial-text">
                                An incredible tool that connects passionate volunteers with meaningful opportunities seamlessly.
                            </p>
                            <div className="copa-testimonial-rating">★★★★★</div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="copa-testimonial-card">
                            <div className="copa-testimonial-header">
                                <div className="copa-testimonial-avatar">
                                    <img src="https://i.pravatar.cc/150?img=52" alt="Saif Ahmed" />
                                </div>
                                <div className="copa-testimonial-info">
                                    <div className="copa-testimonial-name">Saif Ahmed</div>
                                    <div className="copa-testimonial-role">NGO Director</div>
                                </div>
                            </div>
                            <p className="copa-testimonial-text">
                                An incredible tool that connects passionate volunteers with meaningful opportunities seamlessly.
                            </p>
                            <div className="copa-testimonial-rating">★★★★★</div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="copa-footer">
                <div className="copa-footer-container">
                    <div className="copa-footer-logo">
                        <div className="copa-logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <span className="copa-logo-text">Local Volunteer Radar</span>
                    </div>
                    <p className="copa-footer-text">
                        © 2025 Local Volunteer Radar. Making a difference together.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;