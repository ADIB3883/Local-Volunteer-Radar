import { useState } from "react";
import EmailIcon from "../../assets/icons/email.png"
import DownloadIcon from "../../assets/icons/download.png"
import MarkIcon from "../../assets/icons/check-mark.png"
import CancelIcon from "../../assets/icons/cancel.png"
import SendIcon from "../../assets/icons/send.png"
import CloseIcon from "../../assets/icons/close.png"
import InfoIcon from "../../assets/icons/info.png"

function QuickAction(){
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementMessage, setAnnouncementMessage] = useState("");

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setAnnouncementTitle("");
        setAnnouncementMessage("");
    };

    const handleSendAnnouncement = () => {
        // Handle sending announcement logic here
        console.log("Title:", announcementTitle);
        console.log("Message:", announcementMessage);
        closePopup();
    };

    return (
        <>
            <div className="
            relative top-[25vh] left-[5.5vw] w-[90vw] py-3
            bg-white border border-[#C5C5C5]
            rounded-[20px] shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
            flex flex-col
            ">
                <div className="relative bg-transparent w-full h-[30px]">
                    <span className="absolute left-[1.3%]
                    text-black font-bold font-[16px]">Quick Actions</span>
                </div>

                {/* buttons */}
                <div className="relative bg-transparent w-full h-[50px] px-2 py-2  flex flex-1 items-center justify-evenly flex-wrap">
                    <button
                        onClick={openPopup}
                        className="mb-3 border border-[#C5C5C5]  w-[254px] h-[41px] rounded-[8px]
                        flex items-center justify-evenly hover:bg-gray-50 transition-colors"
                    >
                        <img src={EmailIcon} className="w-[20px] h-[20px]" alt="Email"/>
                        <span className="font-normal text-[16px]">Send Announcement</span>
                    </button>

                    <button className="mb-3 border border-[#C5C5C5] w-[254px] h-[41px] rounded-[8px]
                    flex items-center justify-evenly hover:bg-gray-50 transition-colors"
                    >
                        <img src={DownloadIcon} className="w-[20px] h-[20px]" alt="Download"/>
                        <span className="font-normal text-[16px]">Export volunteer list</span>
                    </button>

                    <button className="mb-3 border border-[#C5C5C5] w-[254px] h-[41px] rounded-[8px]
                    flex items-center justify-evenly hover:bg-gray-50 transition-colors"
                    >
                        <img src={MarkIcon} className="w-[20px] h-[20px]" alt="Mark"/>
                        <span className="font-normal text-[16px]">Mark as complete</span>
                    </button>

                    <button className="border border-[#C5C5C5] w-[254px] h-[41px] rounded-[8px]
                    flex items-center justify-evenly hover:bg-gray-50 transition-colors"
                    >
                        <img src={CancelIcon} className="w-[20px] h-[20px]" alt="Cancel"/>
                        <span className="font-normal text-[#DB004B] text-[16px]">Cancel Event</span>
                    </button>
                </div>
            </div>

            {/* Popup*/}
            {isPopupOpen && (
                <div className="fixed top-0 bottom-0 left-0 right-0 bg-[#000000]/40 flex items-center justify-center z-11">
                    <div className="bg-white rounded-[20px] w-[475px] h-[450px] relative">
                        <div className="w-full h-[20px]"></div>
                        {/* Header */}
                        <div className="relative left-[5%] flex items-start gap-3">

                            <div className="flex flex-col">
                                <div className="w-full h-[3px]"></div>
                                <div className="w-[33px] h-[33px] bg-[linear-gradient(131.73deg,#0067DD_5.55%,#00AD4B_71.83%)] rounded-[10px] flex items-center justify-center flex-shrink-0">
                                    <img src={SendIcon} className="w-[20px] h-[20px]" alt="Send"/>
                                </div>
                            </div>

                            <div className="" flex flex-col gap-2>
                                <h2 className="w-[348px]  font-bold text-[18px] text-black">Send Announcement</h2>
                                <p className="w-[348px] text-[13px] text-[#666]">Notify all approved volunteers about updates for Relief Distribution</p>
                            </div>
                            <button
                                onClick={closePopup}
                                className="relative left-[15px] text-[#666] hover:text-black text-[24px] leading-none"
                            >
                                <img src={CloseIcon} className="w-[10px] h-[10px]" alt="Cancel"/>
                            </button>
                        </div>
                        <div className="w-full h-[15px]"></div>

                        {/* Form */}
                        <div className=" relative left-[5%] px-6 pb-6">
                            <div className="flex flex-col">
                                <label className="block text-[14px] font-bold text-black    ">
                                    Announcement Title
                                </label>
                                <div className="w-full h-[5px]"></div>
                                <input
                                    type="text"
                                    value={announcementTitle}
                                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                                    placeholder=" e.g., Important Update: Event Time Changed"
                                    className="w-[90%] h-[30px] rounder-[10px] border border-[#C9C9C9] rounded-[8px]  text-[14px] focus:outline-none focus:border-[#00A63E]"
                                />
                            </div>

                            <div className="w-full h-[15px]"></div>

                            <div className="mb-4">
                                <label className="block text-[14px] font-bold text-black">
                                    Message
                                </label>
                                <div className="w-full h-[5px]"></div>
                                <textarea
                                    value={announcementMessage}
                                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                                    placeholder=" Write your announcement message here..."
                                    className="w-[90%] max-h-[70px] border border-[#C9C9C9] rounded-[10px] text-[14px] h-[70px] resize-y focus:outline-none focus:border-[#00A63E]"
                                />
                            </div>

                            <div className="w-[90%] h-[20px]"></div>
                            {/* Info Message */}
                            <div className="w-[90%] h-[56px] flex items-center gap-2 bg-[linear-gradient(90deg,_#DDECF7_41.35%,_#FFFFFF_100%)] border border-[#93D1FF] rounded-[8px] ">
                                <div className=" relative left-[8px] bottom-[5px]">
                                    <img src={InfoIcon} className="w-[25px] h-auto " alt="Send"/>
                                </div>
                                <p className="relative left-2 w-[95%] text-[13px] font-bold font-sans text-[#2C2C2C]">
                                    This announcement will be sent to all approved volunteers registered for this event.
                                </p>
                            </div>


                            <div className="w-[90%] h-[20px]"></div>
                            {/* Buttons */}
                            <div className="flex gap-3 justify-end relative right-[47px]">
                                <button
                                    onClick={closePopup}
                                    className="w-[75px] h-[30px] border border-[#C9C9C9] rounded-[5px] text-[14px] font-medium
                                    shadow-[0px_0.5px_4px_rgba(0,0,0,0.25)]
                                     hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendAnnouncement}
                                    className="w-[145px] h-[30px] text-white bg-[linear-gradient(90deg,#0067DD_0%,#00AD4B_100%)] rounded-[5px] text-[14px] font-medium
                                    "
                                >
                                    Send Announcement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default QuickAction;