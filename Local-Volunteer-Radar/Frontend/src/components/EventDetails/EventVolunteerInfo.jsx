import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EditButton from "./EditButton.jsx";
import DeleteButton from "./DeleteButton.jsx";
import FilterButtons from "./VolunteerFilterButtons.jsx";
import EventVolunteerProfile from "./EventVolunteerProfile.jsx";
import NoVolunteer from "./NoVolunteer.jsx"
import userGray from "../../assets/icons/user gray.png"
import Joel from "../../assets/icons/joel.jpeg"
import Ellie from "../../assets/icons/ellie.jpeg"

function EventVolunteerInfo(){
    const { eventId } = useParams();
    const [volunteers, setVolunteers] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");

    // Load volunteers from registrations
    useEffect(() => {
        const loadVolunteers = () => {
            const allRegistrations = JSON.parse(localStorage.getItem('eventRegistrations')) || [];
            const eventRegs = allRegistrations.filter(
                reg => reg.eventId === parseInt(eventId)
            );

            // Transform registrations into volunteer format
            const volunteersData = eventRegs.map(reg => ({
                id: reg.id,
                pic: reg.volunteerPic || userGray,
                name: reg.volunteerName,
                registerDate: new Date(reg.registeredAt).toLocaleDateString('en-GB'),
                eventsCompleted: reg.eventsCompleted,
                volunteerStatus: reg.status,
                actionTaken: reg.status !== 'Pending',
                email: reg.volunteerEmail,
                phone: reg.volunteerPhone,
                hoursVolunteered: reg.hoursVolunteered,
                skills: reg.volunteerSkills || [],
                availability: reg.volunteerAvailability || []
            }));

            setVolunteers(volunteersData);
        };

        loadVolunteers();
    }, [eventId]);

    // Volunteer filter er jonne
    const filteredVolunteers = activeFilter === "All"
        ? volunteers
        : volunteers.filter(volunteer=> volunteer.volunteerStatus === activeFilter);

    //Volunteer er status array te change anar jonno
    const updateVolunteerStatus = (volunteerId, newStatus) => {
        // Update in state
        setVolunteers(prevVolunteers =>
            prevVolunteers.map(volunteer =>
                volunteer.id === volunteerId
                    ? { ...volunteer, volunteerStatus: newStatus, actionTaken: true }
                    : volunteer
            )
        );

        // Update in localStorage
        const allRegistrations = JSON.parse(localStorage.getItem('eventRegistrations')) || [];
        const updatedRegistrations = allRegistrations.map(reg =>
            reg.id === volunteerId
                ? { ...reg, status: newStatus }
                : reg
        );
        localStorage.setItem('eventRegistrations', JSON.stringify(updatedRegistrations));

        // Also update the event's volunteer count if approved/rejected
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const eventIndex = events.findIndex(e => e.id === parseInt(eventId));

        if (eventIndex !== -1) {
            // Count approved volunteers
            const approvedCount = updatedRegistrations.filter(
                reg => reg.eventId === parseInt(eventId) && reg.status === 'Approved'
            ).length;

            events[eventIndex].volunteersRegistered = approvedCount;
            localStorage.setItem('events', JSON.stringify(events));
        }
    };

    // 0 volunteer thakle different msg dekhabe
    const getEmptyMessage = () => {
        if (activeFilter === "All") {
            return "No volunteers registered yet";
        } else if (activeFilter === "Pending") {
            return "No pending volunteers";
        } else if (activeFilter === "Approved") {
            return "No approved volunteers";
        }
    };


    return(
        <div className="relative top-[20vh] left-[5.5vw]  w-[90vw]
         bg-white border border-[#C5C5C5]
         rounded-[20px] shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
         flex flex-col items-center">
            <div className="relative bg-transparent w-full h-[30px] ">
                <span className=" absolute top-[25%] left-[1.3%]
            text-black font-bold font-[16px]">Volunteer Management</span>
            </div>

            <div className="relative bg-transparent w-full h-[55px] ">
                <FilterButtons activeFilter={activeFilter} setActiveFilter={setActiveFilter}/>
            </div>

            <div className="w-full h-[20px]"></div>

            {/*Volunteer list dekhabe*/}
            <div className="relative bg-transparent w-[100%] min-h-[128px] flex items-center flex-col justify-around gap-4">

                {filteredVolunteers.length=== 0 ? (
                    <NoVolunteer text={getEmptyMessage()} path={userGray} />
                ) : (
                    filteredVolunteers.map((volunteer,index) =>(
                        <EventVolunteerProfile
                            key={index}
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
                        ></EventVolunteerProfile>
                    ))
                )}
            </div>

            <div className="w-full h-[20px]"></div>
        </div>
    );
}

export default EventVolunteerInfo;