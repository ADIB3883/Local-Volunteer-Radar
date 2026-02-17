import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import EventCardLayout from "./AdminEventCard.jsx";

export default function PendingEventsCard({ event, onActionComplete }) {
    const [action, setAction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    const handleApprove = async () => {
        const eventId = event._id?.$oid || event._id;
        if (!eventId) {
            alert("Invalid event ID");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/admin/events/${eventId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        isApproved: true,
                        status: "active"
                    })
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setAction("approve");
            setIsHidden(true);
            onActionComplete?.();
        } catch (err) {
            setLoading(false);
            alert(err.message || "Failed to approve");
        }
    };

    const handleReject = async () => {
        const eventId = event._id?.$oid || event._id;
        if (!eventId) {
            alert("Invalid event ID");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/admin/events/${eventId}`,
                {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        isApproved: false
                    })
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setAction("reject");
            setIsHidden(true);
            onActionComplete?.();
        } catch (err) {
            setLoading(false);
            alert(err.message || "Failed to reject");
        }
    };

    if (isHidden) {
        return null;
    }

    return (
        <EventCardLayout event={event} showBadges={false} showParticipants={false} iconColor="#2563eb" enableCopyId={true}>
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem"
                    }}
                >
                    <CheckCircle size={16} />
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem"
                    }}
                >
                    <XCircle size={16} />
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