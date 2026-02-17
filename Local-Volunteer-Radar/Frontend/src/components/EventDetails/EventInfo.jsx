import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DeleteButton from "./DeleteButton.jsx";
import EditButton from "./EditButton.jsx";
import CalendarIconn from "../../assets/icons/calendar.png";
import CalendarWhite from "../../assets/icons/calendarWhite.png";
import ClockIcon from "../../assets/icons/clock.png";
import LocationIcon from "../../assets/icons/location.png";
import VolunteerIcon from "../../assets/icons/user.png";
import { X } from "lucide-react";

const API_URL = 'http://localhost:5000/api/events';

const EventInfo = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit modal state
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/${eventId}`);
            setEvent(response.data);
        } catch (error) {
            console.error("Error fetching event:", error);
            alert("Failed to load event details");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEvent = async () => {
        try {
            const response = await axios.put(`${API_URL}/${eventId}`, editData);
            setEvent(response.data);
            setIsEditOpen(false);
            alert("Event updated successfully!");
        } catch (error) {
            console.error("Error updating event:", error);
            alert(error.response?.data?.message || "Failed to update event");
        }
    };

    if (loading) {
        return (
            <div className="relative top-[15vh] left-[5vw] h-[411px] max-w-[90vw] flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading event details...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="relative top-[15vh] left-[5vw] h-[411px] max-w-[90vw] flex items-center justify-center">
                <div className="text-xl text-gray-600">Event not found</div>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    };

    //const capacityPercentage = (event.volunteersRegistered / event.volunteersNeeded) * 100;

    const approvedCount = (event.registrations || []).filter(r => r.status === 'approved').length;
    const capacityPercentage = (approvedCount / event.volunteersNeeded) * 100;

    return (
        <>
            <div className="relative top-[15vh] left-[5vw] h-[411px] max-w-[90vw] bg-[#0065E0] rounded-[20px]">
                <div className="absolute left-[4px] h-[411px] min-h-[300px] w-[90vw] bg-white border border-[#C5C5C5] rounded-[20px] shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                    {/* Header */}
                    <div className="relative flex w-full h-[15%] rounded-tl-[20px] rounded-tr-[20px] bg-[linear-gradient(180deg,#FFFFFF_9.43%,#EEF5FE_85.44%)] items-center py-0 px-2">
                        <span className="relative left-[.5%] font-bold">{event.eventName}</span>
                        <div className="flex items-center gap-3 flex-shrink-0 absolute right-[5%]">
                            <EditButton
                                text="Edit"
                                onClick={() => {
                                    setEditData(event);
                                    setIsEditOpen(true);
                                }}
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="relative top-[0%] w-[100%] h-[80%] flex flex-row justify-between">
                        {/* Left side */}
                        <div className="relative w-[40%] left-0">
                            {/* Date */}
                            <div className="relative w-[250px] h-[20%] top-[15%] left-[2%] flex gap-4">
                                <div className="relative w-[40px] h-[40px] rounded-[10px] bg-[#0065E0]/14 flex items-center justify-center">
                                    <img src={CalendarIconn} alt="Calendar icon" className="w-[25px] h-[25px]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#686868] font-sans font-normal text-[11px]">Date</span>
                                    <span className="text-[#000000] font-sans font-normal text-[16px] leading-[16px]">
                                        {`${new Date(event.startdate).toLocaleDateString('en-GB')} - ${new Date(event.enddate).toLocaleDateString('en-GB')}`}
                                    </span>
                                </div>
                            </div>

                            {/* Time */}
                            <div className="relative w-[250px] h-[20%] top-[15%] left-[2%] flex gap-4">
                                <div className="relative w-[40px] h-[40px] rounded-[10px] bg-[#00AF44]/14 flex items-center justify-center">
                                    <img src={ClockIcon} alt="Clock icon" className="w-[25px] h-[25px]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#686868] font-sans font-normal text-[11px]">Time</span>
                                    <span className="text-[#000000] font-sans font-normal text-[16px] leading-[16px]">
                                        {`${new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })} - ${new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })}`}
                                    </span>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="relative w-[250px] h-[20%] top-[15%] left-[2%] flex gap-4">
                                <div className="relative w-[40px] h-[40px] rounded-[10px] bg-[#00AF44]/14 flex items-center justify-center">
                                    <img src={LocationIcon} alt="Location icon" className="w-[25px] h-[25px]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#686868] font-sans font-normal text-[11px]">Location</span>
                                    <span className="text-[#000000] font-sans font-normal text-[16px] leading-[16px]">{event.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="relative w-[55%] flex flex-col items-center">
                            {/* Volunteers box */}
                            <div className="absolute bg-[linear-gradient(180deg,#EEF5FE_0%,#FFFFFF_100%)] border border-[#C5C5C5] min-w-[80%] h-[183px] top-[10%] rounded-[20px]">
                                <div className="absolute w-[150px] h-[20%] top-[15%] left-[2%] flex gap-2">
                                    <div className="relative w-[40px] h-[40px] rounded-[10px] bg-[transparent]/14 flex items-center justify-center">
                                        <img src={VolunteerIcon} alt="Volunteer icon" className="w-[25px] h-[25px]" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <span className="text-[#000000] font-sans font-normal text-[16px] leading-[16px]">Volunteers</span>
                                    </div>
                                </div>

                                <span className="absolute text-[#0065E0] top-[21%] right-[7%] font-sans font-bold text-[16px] leading-[17px]">
                  {approvedCount} / {event.volunteersNeeded}
                </span>

                                <span className="absolute text-[#0065E0] top-[50%] left-[3.3%] font-sans font-bold text-[24px] leading-[17px]">
                  {approvedCount}
                </span>

                                <div className="absolute top-[70%] left-[3%] bg-[#E2E2E2] w-[90%] h-[11px] rounded-[7px]">
                                    <div
                                        className="bg-[#0065E0] h-full rounded-[7px] transition-all"
                                        style={{ width: `${capacityPercentage}%` }}
                                    ></div>
                                </div>

                                <span className="absolute text-[#404040] font-sans font-normal text-[14px] top-[78%] left-[3.8%]">
                  {Math.round(capacityPercentage)}% capacity filled
                </span>
                            </div>

                            {/* Requirements box */}
                            <div className="absolute bg-[#FAFAFA] border border-[#C5C5C5] min-w-[80%] h-[74px] top-[74%] rounded-[20px]">
                <span className="absolute font-sans font-bold text-[15px] text-[#939393] top-[7%] left-[3%]">
                  Requirements
                </span>
                                <span className="absolute font-sans font-normal text-[14px] top-[50%] left-[3%]">
                  {event.requirements || "No specific requirements"}
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditOpen && (
                <div
                    className="fixed top-0 bottom-0 left-0 right-0 bg-[#000000]/40 flex items-center justify-center z-50 p-4"
                    onClick={(e) => e.target === e.currentTarget && setIsEditOpen(false)}
                >
                    <div
                        className="bg-white w-[50%] rounded-xl shadow-2xl max-w-4xl h-[95vh] overflow-y-auto p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-gray-200 sticky top-0 bg-white">
                            <div className="flex items-center gap-2">
                                <div className="w-14 h-14 bg-[linear-gradient(131.73deg,#0067DD_5.55%,#00AD4B_71.83%)] rounded-xl flex items-center justify-center flex-shrink-0">
                                    <img src={CalendarWhite} alt="Calendar icon" className="w-[35px] h-[35px]" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">Edit Event</h2>
                                    <p className="text-sm text-gray-500">Update your volunteer event details</p>
                                </div>
                            </div>
                            <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-8 space-y-6">
                            {/* Event Name */}
                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2">Event Name *</label>
                                <input
                                    type="text"
                                    name="eventName"
                                    value={editData.eventName || ""}
                                    onChange={(e) => setEditData({ ...editData, eventName: e.target.value })}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter event name"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={editData.description || ""}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                    rows="4"
                                    className="w-full px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe your volunteer event"
                                />
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">Start Date *</label>
                                    <input
                                        type="date"
                                        name="startdate"
                                        value={editData.startdate || ""}
                                        onChange={(e) => setEditData({ ...editData, startdate: e.target.value })}
                                        className="w-full h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">Start Time *</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={editData.startTime || ""}
                                        onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
                                        className="w-full h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">End Date *</label>
                                    <input
                                        type="date"
                                        name="enddate"
                                        value={editData.enddate || ""}
                                        onChange={(e) => setEditData({ ...editData, enddate: e.target.value })}
                                        className="w-full h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">End Time *</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={editData.endTime || ""}
                                        onChange={(e) => setEditData({ ...editData, endTime: e.target.value })}
                                        className="w-full h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={editData.location || ""}
                                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Event location"
                                />
                            </div>

                            {/* Volunteers Needed */}
                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2">Volunteers Needed *</label>
                                <input
                                    type="number"
                                    name="volunteersNeeded"
                                    min="1"
                                    value={editData.volunteersNeeded || ""}
                                    onChange={(e) => setEditData({ ...editData, volunteersNeeded: Number(e.target.value) })}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Number of volunteers"
                                />
                            </div>

                            {/* Requirements */}
                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2">Requirements</label>
                                <textarea
                                    name="requirements"
                                    value={editData.requirements || ""}
                                    onChange={(e) => setEditData({ ...editData, requirements: e.target.value })}
                                    rows="2"
                                    className="w-full pt-2 px-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Any specific requirements or skills needed"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateEvent}
                                    className="px-6 py-3 bg-[linear-gradient(131.73deg,#0067DD_5.55%,#00AD4B_71.83%)] text-white rounded-lg hover:opacity-90 transition-colors font-medium"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EventInfo;