import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditButton from "./EditButton.jsx";
import DeleteButton from "./DeleteButton.jsx";
import AnnouncementButton from "./AnnouncementButton.jsx";
import LogoutButton from "./LogoutButton.jsx";
import MainNav from "./MainNav.jsx";
import EventInfo from "./EventInfo.jsx";
import EventVolunteerInfo from "./EventVolunteerInfo.jsx";
import QuickAction from "./QuickAction.jsx";

const API_URL = 'http://localhost:5000/api/events';
const VOLUNTEER_API_URL = 'http://localhost:5000/api/profile';

function EventDetails() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEventAndVolunteers();
    }, [eventId]);

    const fetchEventAndVolunteers = async () => {
        try {
            setLoading(true);

            // Fetch event
            const eventResponse = await axios.get(`${API_URL}/${eventId}`);
            setEvent(eventResponse.data);

            // Fetch enriched volunteers
            const volunteersResponse = await axios.get(`${API_URL}/${eventId}/volunteers`);

            const volunteersData = volunteersResponse.data.map(reg => ({
                id: reg._id,
                pic: reg.volunteerDetails?.profilePicture || '',
                name: reg.volunteerDetails?.name || 'Unknown',
                registerDate: new Date(reg.registeredAt).toLocaleDateString('en-GB'),
                volunteerStatus: reg.status.charAt(0).toUpperCase() + reg.status.slice(1),
                actionTaken: reg.status !== 'pending',
                email: reg.volunteerDetails?.email || '',
                phone: reg.volunteerDetails?.phoneNumber || '',
                skills: reg.volunteerDetails?.skills || [],
                availability: reg.volunteerDetails?.availability || []
            }));

            setVolunteers(volunteersData);
        } catch (error) {
            console.error('Error fetching event and volunteers:', error);
        } finally {
            setLoading(false);
        }
    };


    const updateVolunteerStatus = async (volunteerId, newStatus) => {
        try {
            // Find the registration and update its status
            const updatedRegistrations = event.registrations.map(reg =>
                reg._id === volunteerId
                    ? { ...reg, status: newStatus.toLowerCase() }
                    : reg
            );

            await axios.put(`${API_URL}/${eventId}`, {
                registrations: updatedRegistrations
            });

            // Reload event and volunteers
            await fetchEventAndVolunteers();
        } catch (error) {
            console.error('Error updating volunteer status:', error);
            alert('Failed to update volunteer status');
        }
    };

    if (loading) {
        return (
            <section className="min-h-screen bg-[linear-gradient(113.19deg,#FFFFFF_0%,#EEF5FE_76.1%)] flex flex-col items-center justify-center">
                <div className="text-xl text-gray-600">Loading event details...</div>
            </section>
        );
    }

    return (
        <section className="
        min-h-screen
        bg-[linear-gradient(113.19deg,#FFFFFF_0%,#EEF5FE_76.1%)]
        flex flex-col
        ">
            <MainNav />
            <EventInfo eventData={event} onEventUpdate={fetchEventAndVolunteers} />
            <EventVolunteerInfo
                volunteers={volunteers}
                onUpdateStatus={updateVolunteerStatus}
                loading={loading}
            />
            <QuickAction />
            <div className="h-[200px]"></div>
        </section>
    );
}

export default EventDetails;