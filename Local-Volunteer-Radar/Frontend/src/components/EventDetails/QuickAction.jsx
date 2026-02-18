import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

// ─── Custom Alert Popup ───────────────────────────────────────────────────────
const CustomAlert = ({ alert, onClose }) => {
    if (!alert) return null;

    const styles = {
        success: { color: '#16a34a', bg: '#f0fdf4', border: '#16a34a' },
        error:   { color: '#dc2626', bg: '#fef2f2', border: '#dc2626' },
        info:    { color: '#0067DD', bg: '#eff6ff', border: '#0067DD' },
    };
    const s = styles[alert.type] || styles.info;

    const Icon = () => {
        if (alert.type === 'success') return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><polyline points="9 12 11.5 14.5 15.5 9.5"/>
            </svg>
        );
        if (alert.type === 'error') return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
        );
        return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
        );
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
            <style>{`@keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.18)', padding: '1.75rem', maxWidth: '400px', width: '90%', border: `1.5px solid ${s.border}`, animation: 'popIn 0.18s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1.5rem' }}>
                    <div style={{ flexShrink: 0, background: s.bg, borderRadius: '50%', padding: '6px', display: 'flex' }}><Icon /></div>
                    <div>
                        {alert.title && <p style={{ fontWeight: '700', fontSize: '1rem', color: '#111', margin: '0 0 0.3rem 0' }}>{alert.title}</p>}
                        <p style={{ fontSize: '0.9rem', color: '#374151', margin: 0, lineHeight: '1.5' }}>{alert.message}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose}
                            style={{ padding: '0.45rem 1.5rem', background: s.color, color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                            onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Custom Confirm Popup ─────────────────────────────────────────────────────
const CustomConfirm = ({ confirm, onConfirm, onCancel }) => {
    if (!confirm) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
            <style>{`@keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.18)', padding: '1.75rem', maxWidth: '400px', width: '90%', border: '1.5px solid #f59e0b', animation: 'popIn 0.18s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1.5rem' }}>
                    <div style={{ flexShrink: 0, background: '#fffbeb', borderRadius: '50%', padding: '6px', display: 'flex' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    </div>
                    <div>
                        {confirm.title && <p style={{ fontWeight: '700', fontSize: '1rem', color: '#111', margin: '0 0 0.3rem 0' }}>{confirm.title}</p>}
                        <p style={{ fontSize: '0.9rem', color: '#374151', margin: 0, lineHeight: '1.5' }}>{confirm.message}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button onClick={onCancel}
                            style={{ padding: '0.45rem 1.25rem', background: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                            onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                            onMouseOut={e => e.currentTarget.style.background = 'white'}>
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                            style={{ padding: '0.45rem 1.25rem', background: confirm.danger ? '#dc2626' : '#d97706', color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                            onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                        {confirm.confirmLabel || 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const QuickAction = () => {
    const { eventId } = useParams();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementMessage, setAnnouncementMessage] = useState("");
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // ─── Dialog state ─────────────────────────────────────────────────────────
    const [alertState, setAlertState] = useState(null);
    const [confirmState, setConfirmState] = useState(null);

    const showAlert = (message, type = 'info', title = '', onClose = null) => {
        setAlertState({ message, type, title, onClose });
    };

    const handleAlertClose = () => {
        const cb = alertState?.onClose;
        setAlertState(null);
        if (cb) cb();
    };

    const showConfirm = ({ title, message, confirmLabel, danger, onConfirm }) => {
        setConfirmState({ title, message, confirmLabel, danger, onConfirm });
    };

    const handleConfirmYes = () => {
        const cb = confirmState?.onConfirm;
        setConfirmState(null);
        if (cb) cb();
    };

    const handleConfirmNo = () => setConfirmState(null);
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/${eventId}`);
            setEvent(response.data);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendAnnouncement = async () => {
        if (!announcementTitle.trim() || !announcementMessage.trim()) {
            showAlert('Please fill in both title and message', 'error', 'Missing Fields');
            return;
        }

        const approvedVolunteers = event.registrations.filter(reg => reg.status === 'approved');

        if (approvedVolunteers.length === 0) {
            showAlert('No approved volunteers to send announcement to', 'info', 'No Recipients');
            return;
        }

        try {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

            await axios.post(`${API_URL}/${eventId}/announcements`, {
                title: announcementTitle,
                message: announcementMessage,
                sentBy: loggedInUser.id
            });

            showAlert(
                `Announcement sent to ${approvedVolunteers.length} approved volunteer(s)!`,
                'success',
                'Announcement Sent',
                async () => {
                    setAnnouncementTitle("");
                    setAnnouncementMessage("");
                    setIsPopupOpen(false);
                    await fetchEvent();
                }
            );
        } catch (error) {
            console.error('Error sending announcement:', error);
            showAlert(error.response?.data?.message || 'Failed to send announcement', 'error', 'Error');
        }
    };

    const handleExportApprovedVolunteers = async () => {
        if (!event) {
            showAlert('Event not found', 'error', 'Error');
            return;
        }

        const approvedRegistrations = event.registrations.filter(reg => reg.status === 'approved');

        if (approvedRegistrations.length === 0) {
            showAlert('No approved volunteers to export', 'info', 'Nothing to Export');
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/${eventId}/volunteers`);
            const enrichedVolunteers = response.data;
            const approved = enrichedVolunteers.filter(v => v.status === 'approved');

            const eventInfoRows = [
                ["Event Name", event.eventName],
                ["Event Date", `${event.startdate || ""} - ${event.enddate || ""}`],
                ["Event Location", event.location || ""],
                ["Total Approved Volunteers", approved.length],
                []
            ];

            const headers = ["Name", "Email", "Phone", "Registered Date", "Status"];
            const rows = approved.map(v => [
                v.volunteerDetails?.name || "N/A",
                v.volunteerDetails?.email || v.volunteerEmail || "N/A",
                v.volunteerDetails?.phoneNumber || "N/A",
                new Date(v.registeredAt).toLocaleDateString("en-GB"),
                v.status
            ]);

            const csvContent = [
                ...eventInfoRows.map(row => row.join(",")),
                headers.join(","),
                ...rows.map(row => row.map(item => `"${item}"`).join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `event_${eventId}_approved_volunteers.csv`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting volunteers:', error);
            showAlert('Failed to export volunteer list', 'error', 'Export Failed');
        }
    };

    const handleMarkAsComplete = () => {
        showConfirm({
            title: 'Mark as Completed',
            message: 'Are you sure you want to mark this event as completed?',
            confirmLabel: 'Mark Complete',
            danger: false,
            onConfirm: async () => {
                try {
                    await axios.put(`${API_URL}/${eventId}/complete`);
                    showAlert('Event marked as completed', 'success', 'Event Completed', fetchEvent);
                } catch (error) {
                    console.error('Error completing event:', error);
                    showAlert(error.response?.data?.message || 'Failed to complete event', 'error', 'Error');
                }
            }
        });
    };

    const handleCancelEvent = () => {
        showConfirm({
            title: 'Cancel Event',
            message: 'Are you sure you want to cancel this event? This action cannot be undone.',
            confirmLabel: 'Cancel Event',
            danger: true,
            onConfirm: async () => {
                try {
                    await axios.put(`${API_URL}/${eventId}/cancel`);
                    showAlert('Event has been cancelled', 'info', 'Event Cancelled', fetchEvent);
                } catch (error) {
                    console.error('Error cancelling event:', error);
                    showAlert(error.response?.data?.message || 'Failed to cancel event', 'error', 'Error');
                }
            }
        });
    };

    if (loading || !event) {
        return (
            <div className="relative top-[25vh] left-[5.5vw] w-[90vw] py-3 bg-white border border-[#C5C5C5] rounded-[20px] shadow-[0px_2px_4px_rgba(0,0,0,0.25)] flex items-center justify-center p-8">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <>
            {/* Custom Dialogs */}
            <CustomAlert alert={alertState} onClose={handleAlertClose} />
            <CustomConfirm confirm={confirmState} onConfirm={handleConfirmYes} onCancel={handleConfirmNo} />

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

                    <button
                        onClick={handleExportApprovedVolunteers}
                        className="mb-3 border border-[#C5C5C5] w-[254px] h-[41px] rounded-[8px] flex items-center justify-evenly hover:bg-gray-50 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        <span className="font-normal text-[16px]">Export volunteer list</span>
                    </button>

                    {!["completed", "cancelled"].includes(event.status) && (
                        <>
                            <button
                                onClick={handleMarkAsComplete}
                                className="mb-3 border border-[#C5C5C5] w-[254px] h-[41px] rounded-[8px] flex items-center justify-evenly hover:bg-gray-50 transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span className="font-normal text-[16px]">Mark as complete</span>
                            </button>

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

            {/* Announcement Popup */}
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