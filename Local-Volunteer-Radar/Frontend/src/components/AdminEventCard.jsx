import React from "react";
import { Calendar, Clock, MapPin, User, FileText, CheckSquare, Tag, AlertCircle, Database } from "lucide-react";

export default function AdminEventCard({ event, children }) {
    const getEventId = () => {
        if (!event) return 'N/A';
        if (event._id?.$oid) return event._id.$oid;
        if (typeof event._id === 'string') return event._id;
        return 'N/A';
    };

    const formatDate = (dateObj) => {
        if (!dateObj) return 'N/A';
        if (dateObj.$date) return new Date(dateObj.$date).toLocaleDateString();
        return new Date(dateObj).toLocaleDateString();
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "#f59e0b",
            active: "#10b981",
            completed: "#3b82f6",
            cancelled: "#ef4444"
        };
        return colors[status] || "#6b7280";
    };

    const getApprovalColor = (isApproved) => {
        return isApproved ? "#10b981" : "#ef4444";
    };

    return (
        <div
            style={{
                background: "#ffffff",
                borderRadius: "0.75rem",
                border: "1px solid #e5e7eb",
                padding: "1rem",
                minWidth: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    alignItems: "center",
                }}
            >
                <strong style={{ fontSize: "1.1rem" }}>{event.eventName || 'N/A'}</strong>
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    ID: {getEventId()}
                </span>
            </div>

            {/* Status and Approval Badges */}
            <div
                style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                }}
            >
                <span
                    style={{
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        background: getStatusColor(event.status),
                        color: "#fff",
                        fontWeight: 600,
                    }}
                >
                    Status: {event.status || 'N/A'}
                </span>
                <span
                    style={{
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        background: getApprovalColor(event.isApproved),
                        color: "#fff",
                        fontWeight: 600,
                    }}
                >
                    {event.isApproved ? 'Approved' : 'Pending Approval'}
                </span>
                {event.isCompleted && (
                    <span
                        style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            background: "#8b5cf6",
                            color: "#fff",
                            fontWeight: 600,
                        }}
                    >
                        Completed
                    </span>
                )}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.25rem",
                    flex: 1,
                    overflow: "auto",
                    marginBottom: "1rem",
                }}
            >
                <div style={{ fontSize: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <Calendar size={14} color="#6b7280" />
                        <span><strong>Start:</strong> {event.startdate || 'N/A'} @ {event.startTime || 'N/A'}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <Calendar size={14} color="#6b7280" />
                        <span><strong>End:</strong> {event.enddate || 'N/A'} @ {event.endTime || 'N/A'}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <MapPin size={14} color="#6b7280" />
                        <span><strong>Location:</strong> {event.location || 'N/A'}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <User size={14} color="#6b7280" />
                        <span><strong>Organizer ID:</strong> {event.organizerId?.$oid || 'N/A'}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <AlertCircle size={14} color="#6b7280" />
                        <span><strong>Volunteers:</strong> {event.volunteersRegistered || 0}/{event.volunteersNeeded || 0}</span>
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <div
                            style={{
                                background: "#e5e7eb",
                                borderRadius: "0.25rem",
                                height: "0.75rem",
                                overflow: "hidden",
                                marginTop: "0.25rem",
                            }}
                        >
                            <div
                                style={{
                                    background: `${((event.volunteersRegistered || 0) / (event.volunteersNeeded || 1)) >= 1 ? "#10b981" : "#3b82f6"}`,
                                    height: "100%",
                                    width: `${Math.min(((event.volunteersRegistered || 0) / (event.volunteersNeeded || 1)) * 100, 100)}%`,
                                    transition: "width 0.3s ease",
                                }}
                            />
                        </div>
                        <span style={{ fontSize: "0.7rem", color: "#6b7280", marginTop: "0.25rem", display: "block" }}>
                            {Math.round(((event.volunteersRegistered || 0) / (event.volunteersNeeded || 1)) * 100)}% filled
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <div
                        style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.6rem",
                            padding: "0.6rem",
                            fontSize: "0.75rem",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                            <FileText size={12} color="#6b7280" />
                            <strong>Description</strong>
                        </div>
                        <p style={{ margin: 0, color: "#4b5563" }}>{event.description || 'N/A'}</p>
                    </div>

                    <div
                        style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.6rem",
                            padding: "0.6rem",
                            fontSize: "0.75rem",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                            <CheckSquare size={12} color="#6b7280" />
                            <strong>Requirements</strong>
                        </div>
                        <p style={{ margin: 0, color: "#4b5563" }}>{event.requirements || 'None'}</p>
                    </div>

                    <div
                        style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.6rem",
                            padding: "0.6rem",
                            fontSize: "0.75rem",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                            <Tag size={12} color="#6b7280" />
                            <strong>Category</strong>
                        </div>
                        <span style={{ color: "#4b5563", fontSize: "0.8rem" }}>{event.category || 'N/A'}</span>
                    </div>

                    <div
                        style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.6rem",
                            padding: "0.6rem",
                            fontSize: "0.75rem",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                            <Database size={12} color="#6b7280" />
                            <strong>Metadata</strong>
                        </div>
                        <div style={{ color: "#6b7280", marginTop: "0.3rem" }}>
                            <div>Created: {formatDate(event.createdAt)}</div>
                            <div>Updated: {formatDate(event.updatedAt)}</div>
                            <div>Announcements: {event.announcements?.length || 0}</div>
                            <div>Registrations: {event.registrations?.length || 0}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {children}
            </div>
        </div>
    );
}