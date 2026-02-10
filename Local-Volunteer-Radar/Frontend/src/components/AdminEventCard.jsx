import React from "react";
import { Calendar, Clock, MapPin, Ruler, User, FileText, CheckSquare, Tag } from "lucide-react";

export default function AdminEventCard({ event, children }) {
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
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    alignItems: "center",
                }}
            >
                <strong style={{ fontSize: "1.1rem" }}>{event.title}</strong>
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    ID: {event.eventId}
                </span>
            </div>

            {/* Content */}
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
                {/* Left */}
                <div style={{ fontSize: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <Calendar size={14} color="#6b7280" />
                        <span><strong>Date:</strong> {event.date}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <Clock size={14} color="#6b7280" />
                        <span><strong>Time:</strong> {event.time}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <MapPin size={14} color="#6b7280" />
                        <span><strong>Location:</strong> {event.location}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <Ruler size={14} color="#6b7280" />
                        <span><strong>Distance:</strong> {event.distance} km</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <User size={14} color="#6b7280" />
                        <span><strong>Organizer ID:</strong> {event.organizerId}</span>
                    </div>
                </div>

                {/* Right */}
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
                        <p style={{ margin: 0, color: "#4b5563" }}>{event.description}</p>
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
                        <p style={{ margin: 0, color: "#4b5563" }}>{event.requirements}</p>
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
                            <strong>Tags</strong>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                            {event.tags?.length > 0 ? (
                                event.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.7rem',
                                            fontWeight: '500',
                                            border: '1px solid',
                                            color: '#4b5563',
                                            background: '#f3f4f6',
                                            borderColor: '#d1d5db'
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>No tags</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div>
                {children}
            </div>
        </div>
    );
}