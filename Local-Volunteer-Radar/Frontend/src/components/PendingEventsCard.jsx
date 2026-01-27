import { useState } from "react";
import EventCardLayout from "./AdminEventCard.jsx";

export default function PendingEventsCard({ event, onActionComplete }) {
    const [action, setAction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/admin/events/approve/${event.eventId}`,
                { method: "PUT", headers: { "Content-Type": "application/json" } }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setAction("approve");
            onActionComplete?.();
        } catch (err) {
            alert(err.message || "Failed to approve");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/admin/events/reject/${event.eventId}`,
                { method: "DELETE" }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setAction("reject");
            onActionComplete?.(); // optional callback to remove from list
        } catch (err) {
            alert(err.message || "Failed to reject");
        } finally {
            setLoading(false);
        }
    };

    return (
        <EventCardLayout event={event}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                    onClick={handleApprove}
                    disabled={loading || action === "approve"}
                    style={{
                        flex: action === "approve" ? 2 : 1,
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #22c55e",
                        background: "#22c55e",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading && action !== "approve"
                        ? "Approving..."
                        : action === "approve"
                            ? "Approved!"
                            : "Approve"}
                </button>

                <button
                    onClick={handleReject}
                    disabled={loading || action === "reject"}
                    style={{
                        flex: action === "reject" ? 2 : 1,
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #ef4444",
                        background: "#ef4444",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading && action !== "reject"
                        ? "Rejecting..."
                        : action === "reject"
                            ? "Rejected!"
                            : "Reject"}
                </button>
            </div>
        </EventCardLayout>
    );
}