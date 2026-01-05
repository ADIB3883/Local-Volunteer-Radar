import { useState } from 'react';
import Joel from "../../assets/icons/joel.jpeg"
import Ellie from "../../assets/icons/ellie.jpeg"
import CancelIcon from "../../assets/icons/cancel.png";
import AcceptIcon from "../../assets/icons/accept.png";

function EventVolunteerProfile({   volunteerId,
                                    pic,
                                   name,
                                   registerDate,
                                   eventsCompleted,
                                   volunteerStatus,
                                   actionTaken,
                                   email,
                                   phone,
                                   hoursVolunteered,
                                    skills=[],
                                   availability=[],
                                   onUpdateStatus
                               }){
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleApprove = () => {
        onUpdateStatus(volunteerId, 'Approved');

    };

    const handleReject = () => {
        onUpdateStatus(volunteerId, 'Rejected');

    };

    const getStatusStyle = () => {
        if (volunteerStatus === 'Approved') {
            return 'bg-[#D4EDDA] border-[#28A745] text-[#28A745]';
        } else if (volunteerStatus === 'Rejected') {
            return 'bg-[#F8D7DA] border-[#DC3545] text-[#DC3545]';
        } else {
            return 'bg-[#FADFCC] border-[#D85500] text-[#D85500]';
        }
    };

    return(
        <div className={`relative w-[93%] ${isExpanded ? 'h-auto' : 'h-[158px]'}
        bg-white border border-[#C5C5C5] rounded-[20px]
        shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
        flex flex-col
        transition-all duration-300
        `}>
            {/* Top Section - Always Visible */}
            <div className="relative w-full min-h-[158px] flex flex-row">
                <div className="relative bg-transparent w-[50%] flex items-center">
                    <div className="absolute left-[20px]">
                        <img src={pic} alt="Joel" className="w-[55px] h-[55px] rounded-full object-cover" />
                    </div>
                    <div className="absolute left-[85px] flex flex-col gap-2">
                        <div className="relative flex gap-4">
                            <span className="font-sans font-bold text-[20px] leading-5">{name}</span>
                            <button
                                onClick={toggleExpand}
                                className="
                                w-[90px] h-[19px]
                                bg-[#E4EDF0]
                                flex items-center justify-center
                                rounded-full
                                hover:bg-[#d4dde0]

                            ">
                                <span className="font-sans text-[12px] text-black">View Profile</span>
                            </button>
                        </div>

                        <span className="text-[#404040] text-[14px]">{"Registered at "+registerDate}</span>
                        <span className="inline-block bg-[#008C4F] text-white
                        rounded-2xl px-2 py-1 font-semibold text-[14px] w-fit">{eventsCompleted+" events completed"}</span>
                    </div>
                </div>

                <div className="relative bg-transparent w-[50%] flex items-center">
                    <div className="absolute  flex items-center justify-center gap-2 right-[20px]">

                        <span className={`${getStatusStyle()} border leading-6 rounded-full text-[15px] font-medium`}>
                            &nbsp;&nbsp;{volunteerStatus}&nbsp;&nbsp;
                        </span>
                        {!actionTaken && (
                            <>
                                <button
                                    onClick={handleApprove}
                                    className="
                                        w-[120px] h-[37px]
                                        bg-[#00A63E]
                                        shadow-[0px_1px_4px_rgba(0,0,0,0.25)]
                                        rounded-[12px]
                                        flex items-center justify-center gap-2
                                        text-white
                                        hover:bg-[#008C34]
                                        transition-colors
                                    ">
                                    <img src={AcceptIcon} alt="Accept icon" className="w-[25px] h-[25px]"/>
                                    <span className="font-medium">Approve</span>
                                </button>

                                <button
                                    onClick={handleReject}
                                    className="
                                    w-[120px] h-[37px]
                                    bg-[#F5F9FB]
                                    border border-[#FFCECE]
                                    shadow-[0px_1px_4px_rgba(0,0,0,0.25)]
                                    rounded-[12px]
                                    flex items-center justify-center gap-2
                                    text-[#DB004B]
                                    hover:bg-[#ffe5e5]
                                    transition-colors
                                ">
                                    <img src={CancelIcon} alt="Cancel icon" className="w-[27px] h-[27px]"/>
                                    <span className="font-medium">Reject</span>
                                </button>
                            </>
                            )}

                    </div>
                </div>
            </div>

            {/* Expanded Section - Shows when expanded */}
            {isExpanded && (
                <div className="relative w-full flex flex-col gap-4  ">
                    <div className="relative left-1/2 -translate-x-1/2 w-[95%] h-[1px] bg-[#C5C5C5] "></div>

                    {/* Contact Section */}
                    <div className="relative ">
                        <div>
                            <h3 className="relative left-[2%] font-sans font-semibold text-[14px] text-[#404040] mb-2">Contact</h3>
                            <div className="w-full h-[10px]"></div>
                            <p className="relative left-[2%] font-sans text-[15px] text-black">{email}</p>
                            <p className="relative left-[2%] font-sans text-[15px] text-black">{phone}</p>
                        </div>

                    </div>

                    {/* Skills Section */}
                    <div className="relative">
                        <h3 className="relative left-[2%] font-semibold text-[14px] text-[#404040]">Skills</h3>
                        <div className="w-full h-[10px]"></div>
                        <div className="relative left-[2%] flex gap-2">
                            {skills.length > 0 ? (
                                skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="bg-[#F2F7FC] border border-[#CADFF4] h-[25px] flex items-center justify-center rounded-[20px] px-3"
                                    >
                                        <span className="text-[14px] leading-0">{skill}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[14px] font-sans text-[#404040]">No skills listed</p>
                            )}
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div className="relative">
                        <h3 className="relative left-[2%] font-semibold text-[14px] text-[#404040]">Experience</h3>
                        <div className="w-full h-[10px]"></div>
                        <div className="relative left-[2%] flex gap-8">
                            <div className="flex flex-col bg-[#E6F7FF] rounded-[7px] w-[304px] h-[47px] items-center justify-end">
                                <p className="text-[20px] font-bold text-[#0065E0]">{eventsCompleted}</p>
                                <p className="text-[14px] text-[#404040]">Events</p>
                            </div>
                            <div className="flex flex-col bg-[#E6F7FF] rounded-[7px] w-[304px] h-[47px] items-center justify-end">
                                <p className="text-[20px] font-bold text-[#0065E0]">{hoursVolunteered}</p>
                                <p className="text-[14px] text-[#404040]">Hours</p>
                            </div>
                        </div>
                    </div>

                    {/* Availability Section */}
                    <div className="relative left-[2%] ">
                        <h3 className="font-semibold text-[14px] text-[#404040] mb-2">Availability</h3>
                        <div className="w-full h-[10px]"></div>
                        <div className="flex gap-2 flex-wrap">
                            {availability.length > 0 ? (
                                availability.map((slot, index) => (
                                    <div
                                        key={index}
                                        className="bg-[#008C4F] h-[25px] flex items-center justify-center rounded-[20px] px-3"
                                    >
                                        <span className="text-[14px] text-white leading-0">
                                            {slot.day}: {slot.time}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[14px] text-[#404040]">No availability set</p>
                            )}

                        </div>
                    </div>
                    <div className="w-full h-[10px]"></div>
                </div>
            )}
        </div>
    );
}

export default EventVolunteerProfile;