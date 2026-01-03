import React, { useState } from 'react';
//import { useRef } from 'react';
//import { useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard/StatusCards.css';

//import volunteerIcon from '../assets/icons/volunteer-icon.png';
//import organizerIcon from '../assets/icons/organizer-icon.png';
//import adminIcon from '../assets/icons/admin-icon.png';
//import logoImage from '../assets/icons/logo.png';
//import other icons

//icon as param?

export default function DashboardStats() {
    // const [userType, setUserType] = useState("volunteer");
    // const [activeUserType, setActiveUserType] = useState("volunteer");
    const segments = ['Partners', 'Analytics', 'Pending Registrations', 'Pending Events'];
    const [selectedSegment, setSelectedSegment] = useState(0);

    return (
        <div className="dashboard">

            {/* Header */}
            <header className="header">
                <img src="https://placehold.co/61x71" alt="Logo" />
                <div>
                    <div className="header-title">Admin Dashboard</div>
                    <div className="header-subtitle">Adib</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
                    <img src="https://placehold.co/22x22" alt="Logout icon" />
                    <span>Logout</span>
                </div>
            </header>

            {/* Stats */}
            <section className="stats-grid">
                <div className="stat-card">
                    <div className="stat-title">Total Volunteers</div>
                    <div className="stat-value" style={{ color: "#0065E0" }}>170</div>
                    <div className="stat-desc">Volunteers across the country</div>
                </div>

                <div className="stat-card">
                    <div className="stat-title">Active Volunteers</div>
                    <div className="stat-value" style={{ color: "#0065E0" }}>88</div>
                    <div className="stat-desc">Currently volunteering</div>
                </div>

                <div className="stat-card green">
                    <div className="stat-title">Total Organizers</div>
                    <div className="stat-value" style={{ color: "#00AF44" }}>39</div>
                    <div className="stat-desc">Organizers registered</div>
                </div>

                <div className="stat-card green">
                    <div className="stat-title">Active Organizers</div>
                    <div className="stat-value" style={{ color: "#00AF44" }}>20</div>
                    <div className="stat-desc">Organizers currently working</div>
                </div>
            </section>

            <div className="segmented" style={{ marginLeft: 52 }}>
                {segments.map((label, idx) => (
                    <>
                        <div
                            key={idx}
                            className={`segment ${selectedSegment === idx ? 'active' : ''}`}
                            onClick={() => setSelectedSegment(idx)}
                        >
                            {label}
                        </div>
                        {idx < 3 && <div className="segment-divider" />}
                    </>
                ))}
            </div>

            <div className="section-bar">
                <div className="section-title">
                    {["Manage Partners.", "Insights and Data Visualization.", "Review and Approve Volunteering Opportunities.", "Review and Approve Event Requests."][selectedSegment]}
                </div>
            </div>

            {selectedSegment === 1 ? (
                <section className="charts-grid">
                    <div className="chart-card">

                        <img
                            src="https://placehold.co/500x500"
                            className="chart-photo"
                        />
                        <alt>Hours Worked</alt>
                        <div className="chart-desc">Volunteers, across the country</div>
                    </div>
                </section>
            ) : (
                    <div className="table-wrapper">
                        <div className="table-row table-header">
                            <div>Name</div>
                            <div>Email</div>
                            <div>Status</div>
                            <div>Type</div>
                            <div>Joined</div>
                        </div>

                        <div className="table-row">
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div
                                    className="avatar"
                                    style={{ backgroundImage: "url(https://placehold.co/24x24)" }}
                                />
                                Buzz Osborne
                            </div>
                            <div>buzz@example.com</div>
                            <div><span className="badge active">Active</span></div>
                            <div><span className="badge volunteer">Volunteer</span></div>
                            <div>25 Jun</div>
                        </div>

                        <div className="table-row">
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div
                                    className="avatar"
                                    style={{ backgroundImage: "url(https://placehold.co/24x24)" }}
                                />
                                Lucas Harrington
                            </div>
                            <div>lucas@example.com</div>
                            <div><span className="badge active">Active</span></div>
                            <div><span className="badge ngo">NGO</span></div>
                            <div>1 Jun</div>
                        </div>
                    </div>
            )}
        </div>
    );

}