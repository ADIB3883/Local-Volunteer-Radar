import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Radio, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const EventCard = ({
                       eventId,
                       title,
                       organizerId,
                       description,
                       tags,
                       date,
                       time,
                       location,
                       distance,
                       requirements,
                       onRegister
                   }) => {
    const navigate = useNavigate();
    const [registrationStatus, setRegistrationStatus] = useState(null);

    // Check registration status on mount and when eventId changes
    useEffect(() => {
        const checkRegistrationStatus = () => {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!loggedInUser) return;

            const registrations = JSON.parse(localStorage.getItem('eventRegistrations')) || [];
            const userRegistration = registrations.find(
                reg => reg.eventId === eventId && reg.volunteerEmail === loggedInUser.email
            );

            if (userRegistration) {
                setRegistrationStatus(userRegistration.status);
            } else {
                setRegistrationStatus(null);
            }
        };

        checkRegistrationStatus();
    }, [eventId]);

    const handleRegister = () => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        if (!loggedInUser) {
            alert("Please login to register");
            return;
        }

        if (loggedInUser.role !== "volunteer") {
            alert("Only volunteers can register for events");
            return;
        }

        // Get all events
        const events = JSON.parse(localStorage.getItem('events')) || [];

        // Find the specific event
        const eventIndex = events.findIndex(e => e.id === eventId);

        if (eventIndex === -1) {
            alert("Event not found");
            return;
        }

        // Get existing registrations or initialize
        const registrations = JSON.parse(localStorage.getItem('eventRegistrations')) || [];

        // Check if already registered
        const alreadyRegistered = registrations.some(
            reg => reg.eventId === eventId && reg.volunteerEmail === loggedInUser.email
        );

        if (alreadyRegistered) {
            alert("You are already registered for this event");
            return;
        }

        // Check if event is full
        if (events[eventIndex].volunteersRegistered >= events[eventIndex].volunteersNeeded) {
            alert("Event is full");
            return;
        }

        // Create registration
        const newRegistration = {
            id: Date.now(),
            eventId: eventId,
            eventName: title, // Store event name for display
            eventDate: date,
            eventTime: time,
            eventLocation: location,
            volunteerEmail: loggedInUser.email,
            volunteerName: loggedInUser.fullName || loggedInUser.name || "Volunteer",
            volunteerPhone: loggedInUser.phone || "",
            volunteerSkills: loggedInUser.skills || [],
            volunteerAvailability: loggedInUser.availability || [],
            eventsCompleted: loggedInUser.eventsCompleted || "0",
            hoursVolunteered: loggedInUser.hoursVolunteered || "0",
            status: 'Pending',
            actionTaken: false,
            registeredAt: new Date().toISOString()
        };

        // Add registration
        registrations.push(newRegistration);
        localStorage.setItem('eventRegistrations', JSON.stringify(registrations));

        // Update event volunteer count
        events[eventIndex].volunteersRegistered = (events[eventIndex].volunteersRegistered || 0) + 1;
        localStorage.setItem('events', JSON.stringify(events));

        alert("Successfully registered for the event! Your registration is pending organizer approval.");

        // Update local status
        setRegistrationStatus('Pending');

        // Call parent callback if provided to refresh the UI
        if (onRegister) {
            onRegister();
        }
    };
const handleMessageOrganizer = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("Please login to message organizers");
        return;
    }

    if (loggedInUser.role !== "volunteer") {
        alert("Only volunteers can message organizers");
        return;
    }

    // Navigate to conversation with this organizer
    navigate(`/volunteer/messages/conv_${eventId}`);
};
    const getButtonContent = () => {
        if (!registrationStatus) {
            return "Register to Volunteer";
        }

        switch(registrationStatus) {
            case 'Pending':
                return "⏳ Registration Pending";
            case 'Approved':
                return "✓ Registered";
            case 'Rejected':
                return "✗ Registration Rejected";
            default:
                return "Register to Volunteer";
        }
    };

    const getButtonStyle = () => {
        if (!registrationStatus) {
            return {
                background: 'linear-gradient(to right, #3b82f6, #10b981)',
                cursor: 'pointer'
            };
        }

        switch(registrationStatus) {
            case 'Pending':
                return {
                    background: 'linear-gradient(to right, #f59e0b, #f97316)',
                    cursor: 'not-allowed'
                };
            case 'Approved':
                return {
                    background: 'linear-gradient(to right, #10b981, #059669)',
                    cursor: 'not-allowed'
                };
            case 'Rejected':
                return {
                    background: 'linear-gradient(to right, #ef4444, #dc2626)',
                    cursor: 'not-allowed'
                };
            default:
                return {
                    background: 'linear-gradient(to right, #3b82f6, #10b981)',
                    cursor: 'pointer'
                };
        }
    };

    return (
        <div
            style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
        >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>
                {title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: '0 0 1rem 0' }}>
                {description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            border: '1px solid',
                            color: tag.type === 'skill' ? '#0891b2' : '#4b5563',
                            background: tag.type === 'skill' ? '#cffafe' : '#f3f4f6',
                            borderColor: tag.type === 'skill' ? '#67e8f9' : '#d1d5db'
                        }}
                    >
                        {tag.name}
                    </span>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    <Calendar size={16} style={{ color: '#3b82f6' }} />
                    <span>{date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    <Clock size={16} style={{ color: '#10b981' }} />
                    <span>{time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    <MapPin size={16} style={{ color: '#ef4444' }} />
                    <span>{location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                    <Radio size={16} style={{ color: '#a855f7' }} />
                    <span>{distance}</span>
                </div>
            </div>

            <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontWeight: '600' }}>Requirements:</span> {requirements}
            </div>

            {/* Button Group - Register and Message */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {/* Register Button */}
                <button
                    onClick={registrationStatus ? null : handleRegister}
                    disabled={!!registrationStatus}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        ...getButtonStyle(),
                        color: 'white',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s',
                        opacity: registrationStatus ? 0.9 : 1
                    }}
                >
                    {getButtonContent()}
                </button>

                {/* Message Organizer Button */}
                <button
                    onClick={handleMessageOrganizer}
                    style={{
                        padding: '0.75rem 1rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '50px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px -1px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3)';
                    }}
                    title="Message Organizer"
                >
                    <MessageCircle size={20} />
                </button>
            </div>
        </div>
    );
};

export default EventCard;