import DeleteButton from "./DeleteButton.jsx";
import EditButton from "./EditButton.jsx";
import CalendarIcon from "../../assets/icons/calendar.png";
import ClockIcon from "../../assets/icons/clock.png";
import LocationIcon from "../../assets/icons/location.png";
import VolunteerIcon from "../../assets/icons/user.png";

const EventInfo = ({ EventName }) => {

    return (
        <div className="
         relative top-[15vh] left-[5vw] h-[411px]  max-w-[90vw]
         bg-[#0065E0] rounded-[20px]

        ">
            {/*Ashol BOX*/}
            <div className="
             absolute left-[4px] h-[411px] min-h-[300px] w-[90vw]
             bg-white border border-[#C5C5C5] rounded-[20px] shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
            ">
                {/*uporer box jeikhane name thake*/}
                <div className="relative flex w-full h-[15%] rounded-tl-[20px] rounded-tr-[20px]
                bg-[linear-gradient(180deg,#FFFFFF_9.43%,#EEF5FE_85.44%)] items-center py-0 px-2
                ">
                    <span className="relative left-[1%] font-bold">{EventName}</span>
                    <div className="flex items-center gap-3 flex-shrink-0 absolute right-[2%]">
                        <EditButton text="Edit"></EditButton>
                        <DeleteButton text="Delete"></DeleteButton>
                    </div>
                </div>

                {/*Vitorer Details*/}
                <div className="
                    relative
                    top-[0%]
                    w-[100%] h-[80%]

                     flex flex-row justify-between

                     "
                >
                    {/*Vitorer Left side er details*/}
                    <div className="relatiive w-[40%] left-0 " >
                        {/*1st line*/}
                        <div className="relative w-[250px] h-[20%] top-[15%] left-[2%]
                        flex gap-4
                        ">

                            <div className=" relative w-[40px] h-[40px] rounded-[10px] bg-[#0065E0]/14 flex items-center justify-center">
                                    <img src={CalendarIcon} alt="Calendar icon" className="w-[25px] h-[25px]"/>
                            </div>

                            {/*TEXT*/}
                            <div className="flex flex-col">
                                <span className="text-[#686868]
                                font-sans font-normal text-[11px]">Date</span>
                                <span className="text-[#000000]
                                font-sans font-normal text-[16px] leading-[16px]">Monday, December 26</span>
                            </div>

                        </div>
                        {/*2nd line*/}
                        <div className="relative w-[250px] h-[20%] top-[15%] left-[2%]
                         flex gap-4
                        ">
                            <div className=" relative w-[40px] h-[40px] rounded-[10px] bg-[#00AF44]/14 flex items-center justify-center">
                                <img src={ClockIcon} alt="Calendar icon" className="w-[25px] h-[25px]"/>
                            </div>

                            {/*TEXT*/}
                            <div className="flex flex-col">
                                <span className="text-[#686868]
                                font-sans font-normal text-[11px]">Time</span>
                                <span className="text-[#000000]
                                font-sans font-normal text-[16px] leading-[16px]">18:00 - 20:00</span>
                            </div>

                        </div>
                        {/*3rd line*/}
                        <div className="relative w-[250px] h-[20%] top-[15%] left-[2%]
                         flex gap-4
                        ">
                            <div className=" relative w-[40px] h-[40px] rounded-[10px] bg-[#00AF44]/14 flex items-center justify-center">
                                <img src={LocationIcon} alt="Calendar icon" className="w-[25px] h-[25px]"/>
                            </div>

                            {/*TEXT*/}
                            <div className="flex flex-col">
                                <span className="text-[#686868]
                                font-sans font-normal text-[11px]">Location</span>
                                <span className="text-[#000000]
                                font-sans font-normal text-[16px] leading-[16px]">716, Kafrul, Noakhali</span>
                            </div>

                        </div>

                     </div>

                    {/*Vitorer Reft side er details*/}
                    <div className="relatiive w-[55%]  flex flex-col items-center">

                        {/*1st er box*/}
                        <div className="absolute bg-[linear-gradient(180deg,#EEF5FE_0%,#FFFFFF_100%)] border border-[#C5C5C5]
                        min-w-[45%] h-[183px] top-[10%] rounded-[20px]">

                            {/*Volunteers with Icon*/}
                            <div className="absolute w-[150px] h-[20%] top-[15%] left-[2%]
                             flex gap-2
                            ">
                                <div className=" relative w-[40px] h-[40px] rounded-[10px] bg-[transparent]/14 flex items-center justify-center">
                                    <img src={VolunteerIcon} alt="Volunteer icon" className="w-[25px] h-[25px]"/>
                                </div>

                                {/*TEXT*/}
                                <div className="flex items-center justify-center">
                                    <span className="text-[#000000]
                                font-sans font-normal text-[16px] leading-[16px]">Volunteers</span>
                                </div>
                            </div>

                            <span className="absolute text-[#0065E0] top-[21%] right-[7%]
                                font-sans font-bold text-[16px] leading-[17px]">0 / 5</span>
                            <span className="absolute text-[#0065E0] top-[50%] left-[3.3%]
                                font-sans font-bold text-[24px] leading-[17px]">0</span>

                            <div className="absolute top-[70%] left-[3%] bg-[#E2E2E2] w-[90%] h-[11px] rounded-[7px]"></div>
                            <span className="absolute text-[#404040] font-sans font-normal text-[14px] top-[78%] left-[3.8%]">0% capacity filled</span>
                        </div>

                        {/*2nd box*/}
                        <div className="absolute bg-[#FAFAFA] border border-[#C5C5C5]
                        min-w-[45%] h-[74px] top-[74%] rounded-[20px]">
                            <span className="absolute font-sans font-bold text-[15px] text-[#939393]
                                top-[7%] left-[3%]
                            "
                            >Requirements</span>
                            <span className="absolute font-sans font-normal text-[14px]
                                top-[50%] left-[3%]
                            "
                            >Distribution</span>

                        </div>

                    </div>

                </div>
            </div>
        {/*Ashol Box end*/}
        </div>


    );



}

export default EventInfo;