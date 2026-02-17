import { useState } from "react";
import FilterButtons from "./VolunteerFilterButtons.jsx";
import EventVolunteerProfile from "./EventVolunteerProfile.jsx";
import NoVolunteer from "./NoVolunteer.jsx";
import userGray from "../../assets/icons/user gray.png";

function EventVolunteerInfo({ volunteers, onUpdateStatus, loading }) {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredVolunteers = activeFilter === "All"
        ? volunteers.filter(volunteer => volunteer.volunteerStatus !== 'Rejected')
        : volunteers.filter(volunteer => volunteer.volunteerStatus === activeFilter);

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
                    filteredVolunteers.map((volunteer) => (
                        <EventVolunteerProfile
                            key={volunteer.id}
                            volunteerId={volunteer.id}
                            pic={volunteer.pic || userGray}
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
                            onUpdateStatus={onUpdateStatus}
                        />
                    ))
                )}
            </div>

            <div className="w-full h-[20px]"></div>
        </div>
    );
}

export default EventVolunteerInfo;