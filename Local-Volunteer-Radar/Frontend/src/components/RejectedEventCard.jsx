import { useState } from "react";
import EventCardLayout from "./EventCardLayout";

export default function RejectedEventsCard({ event, onRestore }) {
    const [loading, setLoading] = useState(false);

    const handleRestore = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/admin/events/restore/${event.eventId}`,
                { method: "PUT", headers: { "Content-Type": "application/json" } }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            onRestore?.(); // remove from rejected list if needed
        } catch (err) {
            alert(err.message || "Failed to restore event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <EventCardLayout event={event}>
            <button
                onClick={handleRestore}
                disabled={loading}
                style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #22c55e",
                    background: "#22c55e",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                }}
            >
                {loading ? "Restoring..." : "Restore"}
            </button>
        </EventCardLayout>
    );
}