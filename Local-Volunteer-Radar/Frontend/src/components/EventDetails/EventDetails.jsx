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
            const response = await axios.get(`${API_URL}/${eventId}`);
            const eventData = response.data;

            console.log('Event Data:', eventData);
            console.log('Registrations:', eventData.registrations);

            setEvent(eventData);

            // Fetch volunteer details for each registration using email
            const volunteersData = await Promise.all(
                eventData.registrations.map(async (reg) => {
                    console.log('Processing registration:', reg);
                    console.log('Volunteer object:', reg.volunteer);

                    let volunteerDetails = null;

                    // Fetch volunteer details from Volunteer collection using email
                    if (reg.volunteer && reg.volunteer.email) {
                        console.log('Fetching volunteer details for email:', reg.volunteer.email);
                        try {
                            const volResponse = await axios.get(`${VOLUNTEER_API_URL}/${reg.volunteer.email}`);
                            console.log('Volunteer API Response:', volResponse.data);
                            // Extract user data from the response structure
                            volunteerDetails = volResponse.data.user;
                            console.log('Volunteer Details:', volunteerDetails);
                        } catch (error) {
                            console.error(`Error fetching volunteer details for ${reg.volunteer.email}:`, error);
                        }
                    }

                    const transformedData = {
                        id: reg._id,
                        pic: volunteerDetails?.profilePicture || '',
                        name: volunteerDetails?.name || 'Unknown',
                        registerDate: new Date(reg.registeredAt).toLocaleDateString('en-GB'),
                        eventsCompleted: 0,
                        volunteerStatus: reg.status.charAt(0).toUpperCase() + reg.status.slice(1),
                        actionTaken: reg.status !== 'pending',
                        email: volunteerDetails?.email || reg.volunteer?.email || '',
                        phone: volunteerDetails?.phoneNumber || '',
                        hoursVolunteered: 0,
                        skills: volunteerDetails?.skills ? Object.keys(volunteerDetails.skills).filter(key => volunteerDetails.skills[key]) : [],
                        availability: volunteerDetails?.availability || []
                    };

                    console.log('Transformed volunteer data:', transformedData);
                    return transformedData;
                })
            );

            console.log('Final volunteers data:', volunteersData);
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