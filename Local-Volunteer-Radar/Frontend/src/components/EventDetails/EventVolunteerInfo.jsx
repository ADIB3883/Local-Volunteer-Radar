import {useState} from "react";
import EditButton from "./EditButton.jsx";
import DeleteButton from "./DeleteButton.jsx";
import FilterButtons from "./VolunteerFilterButtons.jsx";
import EventVolunteerProfile from "./EventVolunteerProfile.jsx";
import NoVolunteer from "./NoVolunteer.jsx"
import userGray from "../../assets/icons/user gray.png"
import Joel from "../../assets/icons/joel.jpeg"
import Ellie from "../../assets/icons/ellie.jpeg"

function EventVolunteerInfo(){
    const [volunteers, setVolunteers] = useState([
        {
            id: 1,
            pic: Joel,
            name: "Joel Miller",
            registerDate: "21/12/2025",
            eventsCompleted: "12",
            volunteerStatus: "Pending",
            actionTaken: false,
            email: "joel@gmail.com",
            phone: "+8801992002430",
            hoursVolunteered: "48",
            skills: ["first-aid", "medical"],
            availability: [
                {day: 'Sun', time: '08:00-12:00'},
                {day: 'Sat', time: '08:00-12:00'},
                {day: 'Mon', time: '14:00-18:00'}
            ]
        },
        {
            id: 2,
            pic: Ellie,
            name: "Ellie Williams",
            registerDate: "15/12/2025",
            eventsCompleted: "8",
            volunteerStatus: "Pending",
            actionTaken: false,
            email: "ellie@gmail.com",
            phone: "+8801992002431",
            hoursVolunteered: "32",
            skills: ["first-aid", "communication"],
            availability: [
                {day: 'Fri', time: '10:00-14:00'},
                {day: 'Sat', time: '09:00-13:00'}
            ]
        }
    ]);


    // Volunteer filter er jonne
    const [activeFilter, setActiveFilter] = useState("All");
    const filteredVolunteers = activeFilter === "All"
        ? volunteers
        : volunteers.filter(volunteer=> volunteer.volunteerStatus === activeFilter);

    //Volunteer er status  array te cng anar jonno
    const updateVolunteerStatus = (volunteerId, newStatus) => {
        setVolunteers(prevVolunteers =>
            prevVolunteers.map(volunteer =>
                volunteer.id === volunteerId
                    ? { ...volunteer, volunteerStatus: newStatus, actionTaken: true }
                    : volunteer
            )
        );
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
            {/*<div className=" absolute bg-cyan-500 top-[40%]*/}
            {/*  w-[90%] min-h-[158px] bg-black rounded-[15px]*/}
            {/*  flex flex-col items-start*/}
            {/*  ">*/}
            {/*    <EventVolunteerProfile/>*/}

            {/*</div>*/}

        </div>


    );



}
export default EventVolunteerInfo;
