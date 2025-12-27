import React from 'react';
import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="homepage">
            {/* Header */}
            <header className="header">
                <div className="header-container">
                    <div className="logo-section">
                        <div className="logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <span className="logo-text">Local Volunteer Radar</span>
                    </div>
                    <div className="header-actions">
                        <button className="btn-secondary" onClick={() => navigate('/LoginPage.jsx')}>Sign In</button>
                        <button className="btn-primary" onClick={() => navigate('/SignUp')}>Get Started</button>
                    </div>
                </div>
            </header>

            {/* Main Content Wrapper */}
            <main className="main-content">
                {/* Hero Section */}
                <section className="hero-section">
                    <h1 className="hero-title">
                        Connect with <span className="highlight1">Volunteer</span> <span className="highlight2">Opportunities</span> Near You
                    </h1>
                    <p className="hero-description">
                        Connect with local volunteer opportunities and join a community of change makers
                        dedicated to build a better tomorrow.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-hero-primary">Join as Volunteer</button>
                        <button className="btn-hero-secondary">Register Organization</button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <div className="features-header">
                        <h2 className="features-title">Everything you need to volunteer effectively</h2>
                        <p className="features-description">
                            Powerful features designed to help you find, participate, and track your volunteer
                            journey with ease.
                        </p>
                    </div>

                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-card">
                            <div className="feature-icon blue">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <h3 className="feature-title">Find Local Opportunities</h3>
                            <p className="feature-description">
                                Discover volunteer opportunities in your area based on your interests and availability.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-card">
                            <div className="feature-icon teal">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h3 className="feature-title">Connect with Community</h3>
                            <p className="feature-description">
                                Join a network of passionate volunteers and organizations making real impact.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-card">
                            <div className="feature-icon green">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <h3 className="feature-title">Flexible Scheduling</h3>
                            <p className="feature-description">
                                Manage your volunteer commitments with easy scheduling and calendar integration.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-card">
                            <div className="feature-icon purple">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                    <polyline points="17 6 23 6 23 12"></polyline>
                                </svg>
                            </div>
                            <h3 className="feature-title">Growth Analytics</h3>
                            <p className="feature-description">
                                Track your volunteer hours and see the impact you're making in your community.
                            </p>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="about-section">
                    <div className="about-container">
                        <div className="about-content">
                            <h2 className="about-title">Building Stronger Communities Together</h2>
                            <p className="about-text">
                                Local Volunteer Radar was founded on the belief that everyone has something valuable
                                to offer their community. We connect passionate individuals with meaningful
                                opportunities to make a real difference.
                            </p>
                            <p className="about-text">
                                Our platform simplifies the volunteer experience, making it easier than ever to
                                discover causes you care about, connect with like-minded people, and track your
                                positive impact on the world around you.
                            </p>
                        </div>
                        <div className="about-image">
                            <img src="../assets/Volunteer.jpg" alt="Volunteer helping community"/>
                        </div>
                    </div>
                </section>

                {/* Impact Section */}
                <section className="impact-section">
                    <div className="impact-overlay">
                        <h2 className="impact-title">Our Impact by the Numbers</h2>
                        <p className="impact-subtitle">Together, we're making a real difference in communities across the country.</p>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-number">100+</div>
                                <div className="stat-label">Active Volunteers</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">1,000+</div>
                                <div className="stat-label">Hours Volunteered</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Cities Covered</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">40+</div>
                                <div className="stat-label">Partner Organizations</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="contact-section">
                    <h2 className="contact-title">Get in <span className="highlight">Touch</span></h2>
                    <p className="contact-subtitle">
                        We're here to help you make a difference in your community. Reach out to us anytime.
                    </p>
                    <div className="contact-grid">
                        <div className="contact-card">
                            <div className="contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <div className="contact-info">
                                <div className="contact-label">Address</div>
                                <div className="contact-value">Mirpur DOHS, Mirpur, Dhaka</div>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                            </div>
                            <div className="contact-info">
                                <div className="contact-label">Phone</div>
                                <div className="contact-value">01310043083</div>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                            <div className="contact-info">
                                <div className="contact-label">Email</div>
                                <div className="contact-value">hellohero55@gmail.com</div>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <div className="contact-info">
                                <div className="contact-label">Working Hours</div>
                                <div className="contact-value">Sun - Thurs: 8:00 AM-7:00 PM</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="testimonials-section">
                    <h2 className="testimonials-title">Testimonials</h2>
                    <p className="testimonials-subtitle">What our community members are saying</p>

                    <div className="testimonials-grid">
                        {/* Testimonial 1 */}
                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <div className="testimonial-avatar">
                                    <img src="https://i.pravatar.cc/150?img=12" alt="Adib Hoque" />
                                </div>
                                <div className="testimonial-info">
                                    <div className="testimonial-name">Adib Hoque</div>
                                    <div className="testimonial-role">Volunteer</div>
                                </div>
                            </div>
                            <p className="testimonial-text">
                                This platform simplifies everything, making volunteer work more accessible and fulfilling.
                            </p>
                            <div className="testimonial-rating">★★★★★</div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <div className="testimonial-avatar">
                                    <img src="https://i.pravatar.cc/150?img=33" alt="Shihab Ahmed" />
                                </div>
                                <div className="testimonial-info">
                                    <div className="testimonial-name">Shihab Ahmed</div>
                                    <div className="testimonial-role">Volunteer</div>
                                </div>
                            </div>
                            <p className="testimonial-text">
                                An incredible tool that connects passionate volunteers with meaningful opportunities seamlessly.
                            </p>
                            <div className="testimonial-rating">★★★★★</div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <div className="testimonial-avatar">
                                    <img src="https://i.pravatar.cc/150?img=52" alt="Saif Ahmed" />
                                </div>
                                <div className="testimonial-info">
                                    <div className="testimonial-name">Saif Ahmed</div>
                                    <div className="testimonial-role">NGO Director</div>
                                </div>
                            </div>
                            <p className="testimonial-text">
                                An incredible tool that connects passionate volunteers with meaningful opportunities seamlessly.
                            </p>
                            <div className="testimonial-rating">★★★★★</div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-logo">
                        <div className="logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <span className="logo-text">Local Volunteer Radar</span>
                    </div>
                    <p className="footer-text">
                        © 2025 Local Volunteer Radar. Making a difference together.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;