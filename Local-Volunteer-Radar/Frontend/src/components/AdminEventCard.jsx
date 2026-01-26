import React from "react";

export default function AdminEventCard({ event, children }) {
    return (
        <div
            style={{
                background: "#ffffff",
                borderRadius: "0.75rem",
                border: "1px solid #e5e7eb",
                padding: "1rem",
                maxHeight: "280px",
                minWidth: "100%",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                }}
            >
                <strong>{event.title}</strong>
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
                }}
            >
                {/* Left */}
                <div style={{ fontSize: "0.8rem" }}>
                    <p>
                        <strong>Date:</strong> {event.date}
                    </p>
                    <p>
                        <strong>Time:</strong> {event.time}
                    </p>
                    <p>
                        <strong>Location:</strong> {event.location}
                    </p>
                    <p>
                        <strong>Distance:</strong> {event.distance} km
                    </p>
                    <p>
                        <strong>Organizer ID:</strong> {event.organizerId}
                    </p>
                </div>

                {/* Right */}
                <div>
                    <div
                        style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.6rem",
                            padding: "0.6rem",
                            fontSize: "0.75rem",
                            marginBottom: "0.75rem",
                        }}
                    >
                        <strong>Description</strong>
                        <p>{event.description}</p>
                    </div>

                    <div
                        style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.6rem",
                            padding: "0.6rem",
                            fontSize: "0.75rem",
                            marginBottom: "0.75rem",
                        }}
                    >
                        <strong>Requirements</strong>
                        <p>{event.requirements}</p>
                    </div>

                    <div
                        style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.6rem",
                            padding: "0.6rem",
                            fontSize: "0.75rem",
                        }}
                    >
                        <strong>Tags</strong>
                        <p>{event.tags?.length > 0 ? event.tags.join(", ") : "No tags"}</p>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ marginTop: "1rem" }}>{children}</div>
        </div>
    );
}