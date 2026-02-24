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

const API_URL = 'https://local-volunteer-radar.onrender.com/api/events';
const VOLUNTEER_API_URL = 'https://local-volunteer-radar.onrender.com/api/profile';

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

            const volunteersData = await Promise.all(volunteersResponse.data.map(async (reg) => {

                // Fetch this volunteer's full registration history
                const registrationsRes = await axios.get(
                    `https://local-volunteer-radar.onrender.com/api/events/volunteer/${reg.volunteerDetails?.email}/registrations`
                );

                const allRegs = registrationsRes.data.success ? registrationsRes.data.registrations : [];

                // Calculate events completed
                const eventsCompleted = allRegs.filter(
                    r => r.registrationStatus === 'approved' && r.event.status === 'completed'
                ).length;

                // Calculate hours volunteered
                const hoursVolunteered = allRegs
                    .filter(r => r.registrationStatus === 'approved' && r.event.status === 'completed')
                    .reduce((sum, { event }) => {
                        if (!event.startTime || !event.endTime) return sum;
                        const [sh, sm] = event.startTime.split(':').map(Number);
                        const [eh, em] = event.endTime.split(':').map(Number);
                        const dailyMins = (eh * 60 + em) - (sh * 60 + sm);
                        if (dailyMins <= 0) return sum;
                        const start = new Date(event.startdate);
                        const end = new Date(event.enddate || event.startdate);
                        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
                        return sum + (dailyMins / 60) * days;
                    }, 0);

                return {
                    id: reg._id,
                    pic: reg.volunteerDetails?.profilePicture || '',
                    name: reg.volunteerDetails?.name || 'Unknown',
                    registerDate: new Date(reg.registeredAt).toLocaleDateString('en-GB'),
                    volunteerStatus: reg.status.charAt(0).toUpperCase() + reg.status.slice(1),
                    actionTaken: reg.status !== 'pending',
                    email: reg.volunteerDetails?.email || '',
                    phone: reg.volunteerDetails?.phoneNumber || '',
                    skills: reg.volunteerDetails?.skills
                        ? Object.keys(reg.volunteerDetails.skills)
                        : [],
                    availability: reg.volunteerDetails?.availability || [],
                    eventsCompleted,
                    hoursVolunteered: Math.round(hoursVolunteered * 10) / 10
                };
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