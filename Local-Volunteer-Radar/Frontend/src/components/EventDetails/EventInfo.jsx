import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DeleteButton from "./DeleteButton.jsx";
import EditButton from "./EditButton.jsx";
import CalendarIconn from "../../assets/icons/calendar.png";
import CalendarWhite from "../../assets/icons/calendarWhite.png";
import ClockIcon from "../../assets/icons/clock.png";
import LocationIcon from "../../assets/icons/location.png";
import VolunteerIcon from "../../assets/icons/user.png";
import { X, Calendar } from "lucide-react";

const API_URL = 'https://local-volunteer-radar.onrender.com/api/events';

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
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
        );
        return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
        );
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
            <style>{`@keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.18)', padding: '1.75rem', maxWidth: '400px', width: '90%', border: `1.5px solid ${s.border}`, animation: 'popIn 0.18s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1.5rem' }}>
                    <div style={{ flexShrink: 0, background: s.bg, borderRadius: '50%', padding: '6px', display: 'flex' }}>
                        <Icon />
                    </div>
                    <div>
                        {alert.title && <p style={{ fontWeight: '700', fontSize: '1rem', color: '#111', margin: '0 0 0.3rem 0' }}>{alert.title}</p>}
                        <p style={{ fontSize: '0.9rem', color: '#374151', margin: 0, lineHeight: '1.5' }}>{alert.message}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '0.45rem 1.5rem', background: s.color, color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                        onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const EventInfo = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit modal state
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState({});

    // ─── Custom alert state ───────────────────────────────────────────────────
    const [alertState, setAlertState] = useState(null);

    const showAlert = (message, type = 'info', title = '', onClose = null) => {
        setAlertState({ message, type, title, onClose });
    };

    const handleAlertClose = () => {
        const cb = alertState?.onClose;
        setAlertState(null);
        if (cb) cb();
    };
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
            console.error("Error fetching event:", error);
            showAlert('Failed to load event details', 'error', 'Load Error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEvent = async () => {
        // Required fields check
        const requiredFields = ['eventName', 'startdate', 'enddate', 'startTime', 'endTime', 'location', 'category', 'volunteersNeeded'];
        for (const f of requiredFields) {
            if (!String(editData[f] ?? '').trim()) {
                showAlert('Please fill in all required fields.', 'warning', 'Incomplete Form');
                return;
            }
        }

        // Volunteers must be a positive number
        if (isNaN(Number(editData.volunteersNeeded)) || Number(editData.volunteersNeeded) <= 0) {
            showAlert('Please enter a valid number of volunteers needed.', 'warning', 'Invalid Input');
            return;
        }

        // Normalize date strings (handles both "YYYY-MM-DD" and full ISO format)
        const toDateStr = (d) => (d ? d.toString().slice(0, 10) : '');

        // End must be after start
        const startDateTime = new Date(`${toDateStr(editData.startdate)}T${editData.startTime || '00:00'}`);
        const endDateTime   = new Date(`${toDateStr(editData.enddate)}T${editData.endTime || '00:00'}`);

        if (endDateTime < startDateTime) {
            showAlert('The event end must come after the start.', 'warning', 'Invalid Date Range');
            return;
        }

        // Same day → must be at least 15 mins apart
        if (toDateStr(editData.startdate) === toDateStr(editData.enddate) && (endDateTime - startDateTime) / 60000 < 15) {
            showAlert('End time must be at least 15 minutes after start time on the same day.', 'warning', 'Invalid Time Range');
            return;
        }


        try {
            const response = await axios.put(`${API_URL}/${eventId}`, editData);
            setEvent(response.data);
            setIsEditOpen(false);
            showAlert('Event updated successfully!', 'success', 'Event Updated');
        } catch (error) {
            console.error("Error updating event:", error);
            showAlert(error.response?.data?.message || 'Failed to update event', 'error', 'Update Failed');
        }
    };

    if (loading) {
        return (
            <div className="relative top-[15vh] left-[5vw] h-[411px] max-w-[90vw] flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading event details...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="relative top-[15vh] left-[5vw] h-[411px] max-w-[90vw] flex items-center justify-center">
                <div className="text-xl text-gray-600">Event not found</div>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    };

    const approvedCount = (event.registrations || []).filter(r => r.status === 'approved').length;
    const capacityPercentage = (approvedCount / event.volunteersNeeded) * 100;

    const inputStyle = {
        width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb',
        borderRadius: '0.75rem', fontSize: '0.95rem', outline: 'none',
        transition: 'all 0.2s', boxSizing: 'border-box',
    };

    return (
        <>
            {/* Custom Alert Popup */}
            <CustomAlert alert={alertState} onClose={handleAlertClose} />

            <div className="relative top-[15vh] left-[5vw] h-[520px] max-w-[90vw] bg-[#0065E0] rounded-[20px]">
                <div className="absolute left-[4px] h-[520px] min-h-[300px] w-[90vw] bg-white border border-[#C5C5C5] rounded-[20px] shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                    {/* Header */}
                    <div className="relative flex w-full h-[15%] rounded-tl-[20px] rounded-tr-[20px] bg-[linear-gradient(180deg,#FFFFFF_9.43%,#EEF5FE_85.44%)] items-center py-0 px-2">
                        <span className="relative left-[.5%] font-bold">{event.eventName}</span>
                        <div className="flex items-center gap-3 flex-shrink-0 absolute right-[5%]">
                            <EditButton
                                text="Edit"
                                onClick={() => {
                                    setEditData(event);
                                    setIsEditOpen(true);
                                }}
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="relative top-[0%] w-[100%] h-[80%] flex flex-row justify-between">
                        {/* Left side */}
                        <div className="relative w-[40%] left-0">
                            {/* Date */}
                            <div className="relative w-[250px] h-[20%] top-[15%] left-[2%] flex gap-4">
                                <div className="relative w-[40px] h-[40px] rounded-[10px] bg-[#0065E0]/14 flex items-center justify-center">
                                    <img src={CalendarIconn} alt="Calendar icon" className="w-[25px] h-[25px]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#686868] font-sans font-normal text-[11px]">Date</span>
                                    <span className="text-[#000000] font-sans font-normal text-[16px] leading-[16px]">
                                        {`${new Date(event.startdate).toLocaleDateString('en-GB')} - ${new Date(event.enddate).toLocaleDateString('en-GB')}`}
                                    </span>
                                </div>
                            </div>

                            {/* Time */}
                            <div className="relative w-[250px] h-[20%] top-[15%] left-[2%] flex gap-4">
                                <div className="relative w-[40px] h-[40px] rounded-[10px] bg-[#00AF44]/14 flex items-center justify-center">
                                    <img src={ClockIcon} alt="Clock icon" className="w-[25px] h-[25px]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#686868] font-sans font-normal text-[11px]">Time</span>
                                    <span className="text-[#000000] font-sans font-normal text-[16px] leading-[16px]">
                                        {`${new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })} - ${new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })}`}
                                    </span>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="relative w-[250px] h-[20%] top-[15%] left-[2%] flex gap-4">
                                <div className="relative w-[40px] h-[40px] rounded-[10px] bg-[#00AF44]/14 flex items-center justify-center">
                                    <img src={LocationIcon} alt="Location icon" className="w-[25px] h-[25px]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#686868] font-sans font-normal text-[11px]">Location</span>
                                    <span className="text-[#000000] font-sans font-normal text-[16px] leading-[16px]">{event.location}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="relative w-[90%] h-[20%] top-[15%] left-[2%] flex gap-4">
                                <div className="relative w-[40px] h-[40px] rounded-[10px] bg-[#0065E0]/14 flex items-center justify-center flex-shrink-0">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0065E0" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                        <polyline points="10 9 9 9 8 9"/>
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#686868] font-sans font-normal text-[11px]">Description</span>
                                    <span className="text-[#000000] font-sans font-normal text-[14px] leading-[18px] line-clamp-3">
                                        {event.description || "No description provided"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="relative w-[55%] flex flex-col items-center">
                            {/* Volunteers box */}
                            <div className="absolute bg-[linear-gradient(180deg,#EEF5FE_0%,#FFFFFF_100%)] border border-[#C5C5C5] min-w-[80%] h-[183px] top-[10%] rounded-[20px]">
                                <div className="absolute w-[150px] h-[20%] top-[15%] left-[2%] flex gap-2">
                                    <div className="relative w-[40px] h-[40px] rounded-[10px] bg-[transparent]/14 flex items-center justify-center">
                                        <img src={VolunteerIcon} alt="Volunteer icon" className="w-[25px] h-[25px]" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <span className="text-[#000000] font-sans font-normal text-[16px] leading-[16px]">Volunteers</span>
                                    </div>
                                </div>

                                <span className="absolute text-[#0065E0] top-[21%] right-[7%] font-sans font-bold text-[16px] leading-[17px]">
                                    {approvedCount} / {event.volunteersNeeded}
                                </span>

                                <span className="absolute text-[#0065E0] top-[50%] left-[3.3%] font-sans font-bold text-[24px] leading-[17px]">
                                    {approvedCount}
                                </span>

                                <div className="absolute top-[70%] left-[3%] bg-[#E2E2E2] w-[90%] h-[11px] rounded-[7px]">
                                    <div
                                        className="bg-[#0065E0] h-full rounded-[7px] transition-all"
                                        style={{ width: `${capacityPercentage}%` }}
                                    ></div>
                                </div>

                                <span className="absolute text-[#404040] font-sans font-normal text-[14px] top-[78%] left-[3.8%]">
                                    {Math.round(capacityPercentage)}% capacity filled
                                </span>
                            </div>

                            {/* Requirements box */}
                            <div className="absolute bg-[#FAFAFA] border border-[#C5C5C5] min-w-[80%] h-[74px] top-[74%] rounded-[20px]">
                                <span className="absolute font-sans font-bold text-[15px] text-[#939393] top-[7%] left-[3%]">
                                    Requirements
                                </span>
                                <span className="absolute font-sans font-normal text-[14px] top-[50%] left-[3%]">
                                    {event.requirements || "No specific requirements"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Edit Modal ── */}
            {isEditOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)', padding: '1rem' }}
                    onClick={e => { if (e.target === e.currentTarget) setIsEditOpen(false); }}
                >
                    <div
                        style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', maxWidth: '720px', width: '100%', maxHeight: '92vh', overflowY: 'auto' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '2.75rem', height: '2.75rem', background: '#dbeafe', borderRadius: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Calendar size={22} style={{ color: '#3b82f6' }} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Edit Event</h2>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Update your volunteer event details</p>
                                </div>
                            </div>
                            <button onClick={() => setIsEditOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '0.25rem' }}>
                                <X size={22} />
                            </button>
                        </div>

                        {/* Form */}
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* Event Name */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Event Title *</label>
                                <input
                                    type="text"
                                    value={editData.eventName || ''}
                                    onChange={e => setEditData({ ...editData, eventName: e.target.value })}
                                    placeholder="Enter event name"
                                    style={inputStyle}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Description</label>
                                <textarea
                                    value={editData.description || ''}
                                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                                    placeholder="Describe your volunteer event"
                                    rows={3}
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                            </div>

                            {/* Date + Time Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {/* Start Date */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Start Date *</label>
                                    <input
                                        type="date"
                                        value={editData.startdate || ''}
                                        onChange={e => setEditData({ ...editData, startdate: e.target.value })}
                                        style={inputStyle}
                                        onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                    />
                                </div>
                                {/* End Date */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>End Date *</label>
                                    <input
                                        type="date"
                                        value={editData.enddate || ''}
                                        onChange={e => setEditData({ ...editData, enddate: e.target.value })}
                                        style={inputStyle}
                                        onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                    />
                                </div>
                                {/* Start Time */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Start Time *</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            id="editStartTimeInput"
                                            type="time"
                                            value={editData.startTime || ''}
                                            onChange={e => setEditData({ ...editData, startTime: e.target.value })}
                                            style={{ ...inputStyle, paddingRight: '2.5rem' }}
                                            onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                            onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => { const input = document.getElementById('editStartTimeInput'); if (input.showPicker) input.showPicker(); else input.focus(); }}
                                            style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#6b7280' }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {/* End Time */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>End Time *</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            id="editEndTimeInput"
                                            type="time"
                                            value={editData.endTime || ''}
                                            onChange={e => setEditData({ ...editData, endTime: e.target.value })}
                                            style={{ ...inputStyle, paddingRight: '2.5rem' }}
                                            onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                            onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => { const input = document.getElementById('editEndTimeInput'); if (input.showPicker) input.showPicker(); else input.focus(); }}
                                            style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#6b7280' }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Location *</label>
                                <input
                                    type="text"
                                    value={editData.location || ''}
                                    onChange={e => setEditData({ ...editData, location: e.target.value })}
                                    placeholder="Event location"
                                    style={inputStyle}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                            </div>

                            {/* Category + Volunteers Needed */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Category *</label>
                                    <select
                                        value={editData.category || ''}
                                        onChange={e => setEditData({ ...editData, category: e.target.value })}
                                        style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                                        onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <option value="">Select category</option>
                                        <option value="teaching">Teaching</option>
                                        <option value="firstAid">First Aid/Medical</option>
                                        <option value="mediaPhotography">Media/Photography</option>
                                        <option value="technicalSupport">Technical Support</option>
                                        <option value="animalRescue">Animal Rescue/Care</option>
                                        <option value="distribution">Distribution</option>
                                        <option value="eventLogistics">Event Logistics</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Volunteers Needed *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editData.volunteersNeeded || ''}
                                        onChange={e => setEditData({ ...editData, volunteersNeeded: Number(e.target.value) })}
                                        placeholder="Number of volunteers"
                                        style={inputStyle}
                                        onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>

                            {/* Requirements */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Requirements</label>
                                <textarea
                                    value={editData.requirements || ''}
                                    onChange={e => setEditData({ ...editData, requirements: e.target.value })}
                                    placeholder="Any specific requirements or skills needed"
                                    rows={2}
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' }}>
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    style={{ padding: '0.65rem 1.5rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontWeight: '600', color: '#374151', cursor: 'pointer', fontSize: '0.875rem' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                                    onMouseOut={e => e.currentTarget.style.background = 'white'}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateEvent}
                                    style={{ padding: '0.65rem 1.75rem', background: 'linear-gradient(to right, #3b82f6, #10b981)', color: 'white', fontWeight: '600', fontSize: '0.875rem', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}
                                    onMouseOver={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                    onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EventInfo;