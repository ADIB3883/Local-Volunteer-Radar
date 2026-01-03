import EditButton from "./EditButton.jsx";
import DeleteButton from "./DeleteButton.jsx";
import VolunteerFilterButtons from "./VolunteerFilterButtons.jsx";
import EventVolunteerProfile from "./EventVolunteerProfile.jsx";

function EventVolunteerInfo(){




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
                <VolunteerFilterButtons/>
            </div>

            <div className="w-full h-[20px]"></div>

            {/*if i extend here it just grows to top*/}
            <div className="relative bg-transparent w-[100%] min-h-[128px] flex items-center flex-col justify-around gap-4">

                <EventVolunteerProfile/>
                <EventVolunteerProfile/>


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
