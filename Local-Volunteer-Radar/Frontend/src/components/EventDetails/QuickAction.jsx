import React, { useState, useEffect } from 'react';
import EventDetails from "./EventDetails.jsx";

// ============================================
// 1. UPDATE QuickAction.jsx
// ============================================
// Replace your QuickAction component with this:

const QuickAction = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementMessage, setAnnouncementMessage] = useState("");
    const [eventStatus, setEventStatus] = useState("");

    // Get current event from URL
    const eventId = window.location.pathname.split('/').pop();

    useEffect(() => {
        const events = JSON.parse(localStorage.getItem("events") || "[]");
        const event = events.find(e => e.id === parseInt(eventId));

        if (event) {
            setEventStatus(event.status);
        }
    }, [eventId]);



    const handleSendAnnouncement = () => {
        if (!announcementTitle.trim() || !announcementMessage.trim()) {
            alert("Please fill in both title and message");
            return;
        }

        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const events = JSON.parse(localStorage.getItem("events") || "[]");
        const registrations = JSON.parse(localStorage.getItem("eventRegistrations") || "[]");

        const event = events.find(e => e.id === parseInt(eventId));
        if (!event) return;

        // Get only approved volunteers
        const approvedVolunteers = registrations.filter(
            reg => reg.eventId === parseInt(eventId) && reg.status === "Approved"
        );

        if (approvedVolunteers.length === 0) {
            alert("No approved volunteers to send announcement to");
            return;
        }

        const timestamp = new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        // Create announcement for organization
        const announcement = {
            id: Date.now().toString(),
            title: announcementTitle,
            message: announcementMessage,
            eventName: event.eventName,
            timestamp: timestamp,
            recipientCount: approvedVolunteers.length
        };

        const announcements = JSON.parse(localStorage.getItem("announcements") || "[]");
        announcements.push(announcement);
        localStorage.setItem("announcements", JSON.stringify(announcements));

        // Create notifications for each approved volunteer
        const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");

        approvedVolunteers.forEach(volunteer => {
            notifications.push({
                id: `${Date.now()}-${volunteer.volunteerId}`,
                volunteerId: volunteer.volunteerEmail,
                eventName: event.eventName,
                organizationName: loggedInUser?.organizationName || loggedInUser?.fullName || "Organization",
                title: announcementTitle,
                message: announcementMessage,
                timestamp: timestamp,
                read: false
            });
        });

        localStorage.setItem("notifications", JSON.stringify(notifications));

        alert(`Announcement sent to ${approvedVolunteers.length} approved volunteer(s)!`);
        setAnnouncementTitle("");
        setAnnouncementMessage("");
        setIsPopupOpen(false);
    };

    const formatSkills = (skills) => {
        if (!skills || typeof skills !== "object") return "";

        return Object.entries(skills)
            .filter(([_, value]) => value === true)
            .map(([key]) =>
                key
                    .replace(/([A-Z])/g, " $1") // camelCase → words
                    .replace(/^./, str => str.toUpperCase())
            )
            .join(" | ");
    };

    const handleExportApprovedVolunteers = () => {
        const registrations = JSON.parse(
            localStorage.getItem("eventRegistrations") || "[]"
        );

        const events = JSON.parse(
            localStorage.getItem("events") || "[]"
        );

        const event = events.find(e => e.id === parseInt(eventId));
        if (!event) {
            alert("Event not found");
            return;
        }

        // ✅ Only approved volunteers
        const approvedVolunteers = registrations.filter(
            reg =>
                reg.eventId === parseInt(eventId) &&
                reg.status === "Approved"
        );

        if (approvedVolunteers.length === 0) {
            alert("No approved volunteers to export");
            return;
        }

        // -------- Event info rows (TOP) --------
        const eventInfoRows = [
            ["Event Name", event.eventName],
            ["Event Date", event.date || ""],
            ["Event Location", event.location || ""],
            ["Total Approved Volunteers", approvedVolunteers.length],
            [] // empty row
        ];

        // -------- Volunteer table --------
        const headers = [
            "Name",
            "Email",
            "Phone",
            "Registered Date",
            "Hours Volunteered",
            "Skills"
        ];

        const rows = approvedVolunteers.map(v => [
            v.volunteerName,
            v.volunteerEmail,
            v.volunteerPhone,
            new Date(v.registeredAt).toLocaleDateString("en-GB"),
            v.hoursVolunteered || 0,
            formatSkills(v.volunteerSkills)
        ]);

        // -------- Build CSV --------
        const csvContent = [
            ...eventInfoRows.map(row => row.join(",")),
            headers.join(","),
            ...rows.map(row =>
                row.map(item => `"${item}"`).join(",")
            )
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `event_${eventId}_approved_volunteers.csv`;
        link.click();

        URL.revokeObjectURL(url);
    };


    const handleMarkAsComplete = () => {
        const confirmAction = window.confirm(
            "Are you sure you want to mark this event as completed?"
        );

        if (!confirmAction) return;

        const events = JSON.parse(localStorage.getItem("events") || "[]");

        const updatedEvents = events.map(event =>
            event.id === parseInt(eventId)
                ? { ...event, status: "completed", completedAt: new Date().toISOString() }
                : event
        );

        localStorage.setItem("events", JSON.stringify(updatedEvents));

        setEventStatus("completed"); // ✅ update UI instantly

        alert("Event marked as completed");
    };
    const handleCancelEvent = () => {
        const confirmAction = window.confirm(
            "Are you sure you want to cancel this event? This action cannot be undone."
        );

        if (!confirmAction) return;

        const events = JSON.parse(localStorage.getItem("events") || "[]");

        const updatedEvents = events.map(event =>
            event.id === parseInt(eventId)
                ? {
                    ...event,
                    status: "cancelled",
                    cancelledAt: new Date().toISOString()
                }
                : event
        );

        localStorage.setItem("events", JSON.stringify(updatedEvents));

        setEventStatus("cancelled"); // ✅ hide buttons instantly

        alert("Event has been cancelled");
    };







    return (
        <>
            <div className="relative top-[25vh] left-[5.5vw] w-[90vw] py-3 bg-white border border-[#C5C5C5] rounded-[20px] shadow-[0px_2px_4px_rgba(0,0,0,0.25)] flex flex-col">
                <div className="relative bg-transparent w-full h-[30px]">
                    <span className="absolute left-[1.3%] text-black font-bold font-[16px]">Quick Actions</span>
                </div>

                <div className="relative bg-transparent w-full h-[50px] px-2 py-2 flex flex-1 items-center justify-evenly flex-wrap">
                    <button
                        onClick={() => setIsPopupOpen(true)}
                        className="mb-3 border border-[#C5C5C5] w-[254px] h-[41px] rounded-[8px] flex items-center justify-evenly hover:bg-gray-50 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <span className="font-normal text-[16px]">Send Announcement</span>
                    </button>

                    <button  onClick={handleExportApprovedVolunteers} className="mb-3 border border-[#C5C5C5] w-[254px] h-[41px] rounded-[8px] flex items-center justify-evenly hover:bg-gray-50 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        <span className="font-normal text-[16px]">Export volunteer list</span>
                    </button>

                    {!["completed", "cancelled"].includes(eventStatus) && (
                        <>
                            {/* Mark as complete */}
                            <button
                                onClick={handleMarkAsComplete}
                                className="mb-3 border border-[#C5C5C5] w-[254px] h-[41px] rounded-[8px] flex items-center justify-evenly hover:bg-gray-50 transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span className="font-normal text-[16px]">Mark as complete</span>
                            </button>

                            {/* Cancel Event */}
                            <button
                                onClick={handleCancelEvent}
                                className="mb-3 border border-[#C5C5C5] w-[254px] h-[41px] rounded-[8px] flex items-center justify-evenly hover:bg-gray-50 transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DB004B" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                <span className="font-normal text-[#DB004B] text-[16px]">Cancel Event</span>
                            </button>
                        </>
                    )}


                </div>
            </div>

            {isPopupOpen && (
                <div className="fixed top-0 bottom-0 left-0 right-0 bg-[#000000]/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-[20px] w-[475px] p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-[33px] h-[33px] bg-[linear-gradient(131.73deg,#0067DD_5.55%,#00AD4B_71.83%)] rounded-[10px] flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <line x1="22" y1="2" x2="11" y2="13"/>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="font-bold text-[18px] text-black">Send Announcement</h2>
                                <p className="text-[13px] text-[#666]">Notify all approved volunteers about updates</p>
                            </div>
                            <button onClick={() => setIsPopupOpen(false)} className="text-[#666] hover:text-black">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[14px] font-bold text-black mb-2">Announcement Title</label>
                                <input
                                    type="text"
                                    value={announcementTitle}
                                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                                    placeholder="e.g., Important Update: Event Time Changed"
                                    className="w-full px-3 py-2 border border-[#C9C9C9] rounded-[8px] text-[14px] focus:outline-none focus:border-[#00A63E]"
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-bold text-black mb-2">Message</label>
                                <textarea
                                    value={announcementMessage}
                                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                                    placeholder="Write your announcement message here..."
                                    className="w-full px-3 py-2 border border-[#C9C9C9] rounded-[10px] text-[14px] h-[70px] resize-none focus:outline-none focus:border-[#00A63E]"
                                />
                            </div>

                            <div className="flex items-center gap-2 bg-[linear-gradient(90deg,_#DDECF7_41.35%,_#FFFFFF_100%)] border border-[#93D1FF] rounded-[8px] p-3">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0067DD" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="16" x2="12" y2="12"/>
                                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                                </svg>
                                <p className="text-[13px] font-bold text-[#2C2C2C]">
                                    This announcement will be sent to all approved volunteers registered for this event.
                                </p>
                            </div>

                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    onClick={() => setIsPopupOpen(false)}
                                    className="px-4 py-2 border border-[#C9C9C9] rounded-[5px] text-[14px] font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendAnnouncement}
                                    className="px-6 py-2 text-white bg-[linear-gradient(90deg,#0067DD_0%,#00AD4B_100%)] rounded-[5px] text-[14px] font-medium"
                                >
                                    Send Announcement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuickAction;