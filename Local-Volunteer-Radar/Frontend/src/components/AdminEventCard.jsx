import React from "react";
import { Calendar, Clock, MapPin, User, FileText, CheckSquare, Tag } from "lucide-react";

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
                    ID: {event._id?.$oid || 'N/A'}
                </span>
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
                        <span><strong>Date:</strong> {event.startdate || 'N/A'}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <Clock size={14} color="#6b7280" />
                        <span><strong>Time:</strong> {event.startTime || 'N/A'}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <MapPin size={14} color="#6b7280" />
                        <span><strong>Location:</strong> {event.location || 'N/A'}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <User size={14} color="#6b7280" />
                        <span><strong>Organizer ID:</strong> {event.organizerId?.$oid || 'N/A'}</span>
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
                        <p style={{ margin: 0, color: "#4b5563" }}>{event.requirements || 'N/A'}</p>
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
                </div>
            </div>

            <div>
                {children}
            </div>
        </div>
    );
}