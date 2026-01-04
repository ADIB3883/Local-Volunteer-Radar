import React, { useState } from 'react';
import '../styles/AdminDashboard/StatusCards.css';
import '../styles/AdminDashboard/Analytics.css';
import '../styles/AdminDashboard/ApproveRegistrations.css';
import '../styles/AdminDashboard/EventApprovals.css';

function InfoRow({ iconColor, iconImg, label, text }) {
    return (
        <div className="info-row">
            <div className="info-icon" style={{ backgroundColor: iconColor }} />
            <img className="info-icon-img" src={iconImg} alt="" />
            <div className="info-text">{text}</div>
            <div className="info-label">{label}</div>
        </div>
    );
}

function ActionCard({ name, role, time, location, fields }) {
    const [action, setAction] = useState(null);

    return (
        <div className="card">
            <div className="card-base" />
            <div className="card-footer-bg" />

            <div className="card-title">{name}</div>
            <div className="card-role">{role}</div>

            <img className="icon time-icon" src="https://placehold.co/16x16" alt="" />
            <img className="icon location-icon" src="https://placehold.co/16x16" alt="" />

            <div className="card-time">{time}</div>
            <div className="card-location">{location}</div>

            <div className="divider" />

            <div className="card-fields">
                <span className="fields-label">Fields: </span>
                <span className="fields-value">{fields}</span>
            </div>

            <div className="btn-container" style={{ position: "relative", width: "376px" }}>
                {!action && (
                    <>
                        <button className="btn approve-btn" onClick={() => setAction("approve")}>
                            Approve
                        </button>
                        <button className="btn reject-btn" onClick={() => setAction("reject")}>
                            Reject
                        </button>
                    </>
                )}

                {action === "approve" && (
                    <button className="btn approve-btn expanded">Approved!</button>
                )}

                {action === "reject" && (
                    <button className="btn reject-btn expanded">Rejected!</button>
                )}
            </div>
        </div>
    );
}

export default function DashboardStats() {
    const [selectedSegment, setSelectedSegment] = useState(0);
    const [action, setAction] = useState(null);
    const segments = [
        'Partners',
        'Analytics',
        'Pending Registrations',
        'Pending Events',
    ];

    let content;

    if (selectedSegment === 0) {
        content = (
            <div className="table-wrapper">
                <div className="table-row table-header">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Status</div>
                    <div>Type</div>
                    <div>Joined</div>
                </div>

                <div className="table-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                            className="avatar"
                            style={{ backgroundImage: 'url(https://placehold.co/24x24)' }}
                        />
                        Buzz Osborne
                    </div>
                    <div>buzz@example.com</div>
                    <div><span className="badge active">Active</span></div>
                    <div><span className="badge volunteer">Volunteer</span></div>
                    <div>25 Jun</div>
                </div>

                <div className="table-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                            className="avatar"
                            style={{ backgroundImage: 'url(https://placehold.co/24x24)' }}
                        />
                        Lucas Harrington
                    </div>
                    <div>lucas@example.com</div>
                    <div><span className="badge active">Active</span></div>
                    <div><span className="badge ngo">NGO</span></div>
                    <div>1 Jun</div>
                </div>
            </div>
        );
    } else if (selectedSegment === 1) {
        content = (
            <section className="charts-grid">
                <div className="chart-card">
                    <img
                        src="/4cd6d94c-5390-46d7-b09b-8a206ffd97ba.png"
                        alt="Hours Worked"
                        className="chart-photo"
                    />
                    <div className="chart-desc">
                        Volunteers, across the country
                    </div>
                </div>
            </section>
        );
    } else if (selectedSegment === 2) {
        content = (
            <div className="cards-grid">
                <ActionCard
                    name="Shihab Ahmed"
                    role="Volunteer"
                    time="Friday, December 2, 10:00 p.m."
                    location="716, Kafrul, Noakhali"
                    fields="Distribution, Event logistics"
                />
            </div>
        );
    } else if (selectedSegment === 3) {
        content = (
            <div className="event-card">
                <div className="card-header">
                    <div className="event-title">Relief Distribution</div>
                    <div className="event-status">pending</div>
                </div>

                <div className="card-info">
                    <div className="info-row">
                        <div className="info-icon blue-bg" />
                        <img className="info-icon-img" src="https://placehold.co/17x17" alt="" />
                        <div className="info-text">Saturday, November 26, 08:00</div>
                        <div className="info-label">Submitted on</div>
                    </div>

                    <div className="info-row">
                        <div className="info-icon blue-bg" />
                        <img className="info-icon-img" src="https://placehold.co/17x17" alt="" />
                        <div className="info-text">Swapno</div>
                        <div className="info-label">Submitted by</div>
                    </div>

                    <div className="info-row">
                        <div className="info-icon blue-bg" />
                        <div className="info-text">Monday, December 25</div>
                        <div className="info-label">Date</div>
                    </div>

                    <div className="info-row">
                        <div className="info-icon green-bg" />
                        <div className="info-text">18:00 - 21:00</div>
                        <div className="info-label">Time</div>
                    </div>

                    <div className="info-row">
                        <div className="info-icon green-bg" />
                        <div className="info-text">716, Kafrul, Noakhali</div>
                        <div className="info-label">Location</div>
                    </div>
                </div>

                <div className="card-requirements">
                    <div className="volunteers-section">
                        <img className="volunteers-icon" src="https://placehold.co/23x23" alt="" />
                        <div>
                            <div className="volunteers-label">Volunteers</div>
                            <div className="volunteers-count">0</div>
                            <div className="volunteers-capacity">0% capacity filled</div>
                            <div className="volunteers-total">0 / 5</div>
                        </div>
                    </div>

                    <div className="requirements-section">
                        <div className="requirement-title">Requirments</div>
                        <div className="requirement-text">Distribution</div>
                    </div>
                </div>

                <div className="btn-container">
                    {!action && (
                        <>
                            <button className="btn approve-btn" onClick={() => setAction("approve")}>
                                Approve
                            </button>
                            <button className="btn reject-btn" onClick={() => setAction("reject")}>
                                Reject
                            </button>
                        </>
                    )}
                    {action === "approve" && <button className="btn approve-btn expanded">Approved!</button>}
                    {action === "reject" && <button className="btn reject-btn expanded">Rejected!</button>}
                </div>

                <div className="create-event">
                    Create Event
                    <img className="create-event-icon" src="https://placehold.co/15x15" alt="" />
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="header">
                <img src="https://placehold.co/61x71" alt="Logo" />
                <div>
                    <div className="header-title">Admin Dashboard</div>
                    <div className="header-subtitle">Adib</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                    <img src="https://placehold.co/22x22" alt="Logout icon" />
                    <span>Logout</span>
                </div>
            </header>

            <section className="stats-grid">
                <div className="stat-card">
                    <div className="stat-title">Total Volunteers</div>
                    <div className="stat-value" style={{ color: '#0065E0' }}>170</div>
                    <div className="stat-desc">Volunteers across the country</div>
                </div>

                <div className="stat-card">
                    <div className="stat-title">Active Volunteers</div>
                    <div className="stat-value" style={{ color: '#0065E0' }}>88</div>
                    <div className="stat-desc">Currently volunteering</div>
                </div>

                <div className="stat-card green">
                    <div className="stat-title">Total Organizers</div>
                    <div className="stat-value" style={{ color: '#00AF44' }}>39</div>
                    <div className="stat-desc">Organizers registered</div>
                </div>

                <div className="stat-card green">
                    <div className="stat-title">Active Organizers</div>
                    <div className="stat-value" style={{ color: '#00AF44' }}>20</div>
                    <div className="stat-desc">Organizers currently working</div>
                </div>
            </section>

            <div className="segmented" style={{ marginLeft: 52 }}>
                {segments.map((label, idx) => (
                    <React.Fragment key={idx}>
                        <div
                            className={`segment ${selectedSegment === idx ? 'active' : ''}`}
                            onClick={() => setSelectedSegment(idx)}
                        >
                            {label}
                        </div>
                        {idx < segments.length - 1 && (
                            <div className="segment-divider" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="section-bar">
                <div className="section-title">
                    {
                        [
                            'Manage Partners.',
                            'Insights and Data Visualization.',
                            'Review and Approve Volunteering Opportunities.',
                            'Review and Approve Event Requests.',
                        ][selectedSegment]
                    }
                </div>
            </div>

            {content}
        </div>
    );
}
