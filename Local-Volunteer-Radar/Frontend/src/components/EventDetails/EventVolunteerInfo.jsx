import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FilterButtons from "./VolunteerFilterButtons.jsx";
import EventVolunteerProfile from "./EventVolunteerProfile.jsx";
import NoVolunteer from "./NoVolunteer.jsx"
import userGray from "../../assets/icons/user gray.png"

const API_URL = 'http://localhost:5000/api/events';

function EventVolunteerInfo(){
    const { eventId } = useParams();
    const [volunteers, setVolunteers] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVolunteers();
    }, [eventId]);

    const loadVolunteers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/${eventId}`);
            const event = response.data;

            // Transform registrations into volunteer format
            const volunteersData = event.registrations.map(reg => ({
                id: reg._id,
                pic: userGray, // You can add profilePicture to registration if needed
                name: reg.volunteer.name || 'Unknown', // Populated volunteer data
                registerDate: new Date(reg.registeredAt).toLocaleDateString('en-GB'),
                eventsCompleted: 0, // You'll need to track this separately
                volunteerStatus: reg.status.charAt(0).toUpperCase() + reg.status.slice(1), // Capitalize
                actionTaken: reg.status !== 'pending',
                email: reg.volunteer.email || '',
                phone: '', // Add to registration if needed
                hoursVolunteered: 0, // Track separately
                skills: [],
                availability: []
            }));

            setVolunteers(volunteersData);
        } catch (error) {
            console.error('Error loading volunteers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredVolunteers = activeFilter === "All"
        ? volunteers
        : volunteers.filter(volunteer => volunteer.volunteerStatus === activeFilter);

    const updateVolunteerStatus = async (volunteerId, newStatus) => {
        try {
            // Update volunteer status in the event's registrations array
            const response = await axios.get(`${API_URL}/${eventId}`);
            const event = response.data;

            const updatedRegistrations = event.registrations.map(reg =>
                reg._id === volunteerId
                    ? { ...reg, status: newStatus.toLowerCase() }
                    : reg
            );

            await axios.put(`${API_URL}/${eventId}`, {
                registrations: updatedRegistrations
            });

            // Reload volunteers
            await loadVolunteers();
        } catch (error) {
            console.error('Error updating volunteer status:', error);
            alert('Failed to update volunteer status');
        }
    };

    const getEmptyMessage = () => {
        if (activeFilter === "All") {
            return "No volunteers registered yet";
        } else if (activeFilter === "Pending") {
            return "No pending volunteers";
        } else if (activeFilter === "Approved") {
            return "No approved volunteers";
        }
    };

    if (loading) {
        return (
            <div className="relative top-[20vh] left-[5.5vw] w-[90vw] bg-white border border-[#C5C5C5] rounded-[20px] shadow-[0px_2px_4px_rgba(0,0,0,0.25)] flex items-center justify-center p-8">
                <div className="text-xl text-gray-600">Loading volunteers...</div>
            </div>
        );
    }

    return(
        <div className="relative top-[20vh] left-[5.5vw] w-[90vw] bg-white border border-[#C5C5C5] rounded-[20px] shadow-[0px_2px_4px_rgba(0,0,0,0.25)] flex flex-col items-center">
            <div className="relative bg-transparent w-full h-[30px]">
                <span className="absolute top-[25%] left-[1.3%] text-black font-bold font-[16px]">
                    Volunteer Management
                </span>
            </div>

            <div className="relative bg-transparent w-full h-[55px]">
                <FilterButtons activeFilter={activeFilter} setActiveFilter={setActiveFilter}/>
            </div>

            <div className="w-full h-[20px]"></div>

            <div className="relative bg-transparent w-[100%] min-h-[128px] flex items-center flex-col justify-around gap-4">
                {filteredVolunteers.length === 0 ? (
                    <NoVolunteer text={getEmptyMessage()} path={userGray} />
                ) : (
                    filteredVolunteers.map((volunteer, index) => (
                        <EventVolunteerProfile
                            key={volunteer.id}
                            volunteerId={volunteer.id}
                            pic={volunteer.pic}
                            name={volunteer.name}
                            registerDate={volunteer.registerDate}
                            eventsCompleted={volunteer.eventsCompleted}
                            volunteerStatus={volunteer.volunteerStatus}
                            actionTaken={volunteer.actionTaken}
                            email={volunteer.email}
                            phone={volunteer.phone}
                            hoursVolunteered={volunteer.hoursVolunteered}
                            skills={volunteer.skills}
                            availability={volunteer.availability}
                            onUpdateStatus={updateVolunteerStatus}
                        />
                    ))
                )}
            </div>

            <div className="w-full h-[20px]"></div>
        </div>
    );
}

export default EventVolunteerInfo;