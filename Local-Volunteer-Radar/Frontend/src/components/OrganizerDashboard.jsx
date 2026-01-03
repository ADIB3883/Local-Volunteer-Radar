import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, TrendingUp, Megaphone, LogOut, Plus, X, Clock } from 'lucide-react';
import logo from "../assets/logo.png";

// Custom Time Picker Component
const CustomTimePicker = ({ label, value, onChange, name, required = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempHour, setTempHour] = useState('12');
    const [tempMinute, setTempMinute] = useState('00');
    const [tempPeriod, setTempPeriod] = useState('AM');
    const [inputValue, setInputValue] = useState('');
    const inputRef = React.useRef(null);
    // Function to open the time picker modal
    const openPicker = () => {
        if (value) {
            const [h, m] = value.split(':');
            const hour = parseInt(h);
            // Convert 24-hour format to 12-hour format for display
            if (hour === 0) {
                setTempHour('12');
                setTempPeriod('AM');
            } else if (hour < 12) {
                setTempHour(hour.toString());
                setTempPeriod('AM');
            } else if (hour === 12) {
                setTempHour('12');
                setTempPeriod('PM');
            } else {
                setTempHour((hour - 12).toString());
                setTempPeriod('PM');
            }
            setTempMinute(m);
        }
        setIsOpen(true)// Open the modal;
    };
// Converts 12-hour format back to 24-hour format before saving
    const handleConfirm = () => {
        let hour = parseInt(tempHour);

        if (tempPeriod === 'AM') {
            if (hour === 12) hour = 0;
        } else {
            if (hour !== 12) hour += 12;
        }
        // Format the time as HH:MM in 24-hour format
        const formattedTime = `${hour.toString().padStart(2, '0')}:${tempMinute}`;
        onChange({ target: { name, value: formattedTime } });
        setIsOpen(false);
    };
    // Function to handle manual time input
    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);

        // Parse manual input (format: HH:MM AM/PM or HH:MM)
        const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/;
        const match = val.match(timeRegex);

        if (match) {
            let hour = parseInt(match[1]);
            const minute = match[2];
            const period = match[3] ? match[3].toUpperCase() : null;
            // Validate time values
            if (hour >= 0 && hour <= 23 && parseInt(minute) >= 0 && parseInt(minute) <= 59) {
                let finalHour = hour;

                if (period) {
                    // 12-hour format with AM/PM
                    if (period === 'AM' && hour === 12) finalHour = 0;
                    else if (period === 'PM' && hour !== 12) finalHour = hour + 12;
                } else if (hour >= 0 && hour <= 23) {
                    // 24-hour format
                    finalHour = hour;
                }
                 // Format and save the time
                const formattedTime = `${finalHour.toString().padStart(2, '0')}:${minute}`;
                onChange({ target: { name, value: formattedTime } });
            }
        }
    };
// Function to display the time value in 12-hour format with AM/PM
    const displayValue = value ? (() => {
        const [h, m] = value.split(':');
        const hour = parseInt(h);
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 ? 'AM' : 'PM';
        return `${displayHour}:${m} ${period}`;
    })() : '';
// Generate arrays for dropdown options
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    // Calculate modal position based on name (endTime should appear to the right)
    const modalPositionClass = name === 'endTime'
        ? 'fixed top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/2'
        : 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';

    return (
        <div className="relative">
            {/* Label for the time input */}
            <label className="block text-base font-semibold text-gray-700 mb-2">
                {label} {required && '*'}
            </label>
            {/* Time input field with clock icon */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue || displayValue}
                    onChange={handleInputChange}
                    onFocus={() => setInputValue('')}
                    onBlur={() => setInputValue('')}
                    placeholder="HH:MM AM/PM"
                    className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    style={{ marginBottom: '16px' }}
                />
                {/* Clock icon button to open modal */}
                <button
                    type="button"
                    onClick={openPicker}
                    className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded transition-colors"
                >
                    <Clock className="w-5 h-5 text-gray-600" />
                </button>
            </div>
            {/* Time picker modal */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0  bg-opacity-50 z-50"
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Modal content */}
                    <div className={`${modalPositionClass} bg-white rounded-lg shadow-xl z-50 p-6 w-70 `}>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 " style={{marginBottom: '4px'}}>Select Time</h3>
                        {/* Dropdown selectors for hour, minute, and period */}
                        <div className="flex gap-2 mb-6">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2"style={{marginBottom: '4px'}}>Hour</label>
                                <select
                                    value={tempHour}
                                    onChange={(e) => setTempHour(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {hours.map(hour => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2"style={{marginBottom: '4px'}}>Minute</label>
                                <select
                                    value={tempMinute}
                                    onChange={(e) => setTempMinute(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {minutes.map(minute => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2"style={{marginBottom: '4px'}}>Period</label>
                                <select
                                    value={tempPeriod}
                                    onChange={(e) => setTempPeriod(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>
                        {/* Preview of selected time */}
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-center">
                            <span className="text-2xl font-semibold text-blue-700"style={{marginBottom: '4px'}}>
                                {tempHour}:{tempMinute} {tempPeriod}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
// MAIN ORGANIZER DASHBOARD COMPONENT
const OrganizerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');
    const [events, setEvents] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        eventName: '',
        description: '',
        date: '',
        location: '',
        volunteersNeeded: '',
        category: '',
        startTime: '',
        endTime:'',
        requirements: ''
    });
// Handler for form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
// Handler for form submission
    const handleSubmit = () => {
        const newEvent = {
            id: Date.now(),
            ...formData,
            status: 'pending',
            volunteersRegistered: 0,
            createdAt: new Date().toISOString()
        };

        setEvents(prev => [...prev, newEvent]);
        setShowCreateModal(false);
        setFormData({
            eventName: '',
            description: '',
            date: '',
            location: '',
            volunteersNeeded: '',
            category: '',
            startTime: '',
            endTime:'',
            requirements: ''
        });
    };
// Navigation handlers
    const handleLogout = () => {
        navigate('/login');
    };

    const handleAnnouncements = () => {
        console.log('Navigating to announcements...');// Placeholder for announcements feature
    };
    // Helper function to convert date to readable format (e.g., "Friday, January 3")
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };
    // Filter events based on the active tab
    const getFilteredEvents = () => {
        return events.filter(event => event.status === activeTab);
    };
// Calculate statistics for the dashboard cards
    const getStats = () => {
        const activeEvents = events.filter(e => e.status === 'active').length;
        const totalVolunteers = events.reduce((sum, e) => sum + e.volunteersRegistered, 0);
        const totalEvents = events.length;

        return { activeEvents, totalVolunteers, totalEvents };
    };
    // Get appropriate empty state content based on active tab
    const getEmptyStateContent = () => {
        switch(activeTab) {
            case 'pending':
                return {
                    title: 'No events pending approval',
                    description: 'Events you create will appear here while awaiting admin approval'
                };
            case 'completed':
                return {
                    title: 'No completed events yet',
                    description: 'Events that have finished will appear here for your records'
                };
            default:
                return {
                    title: 'No active events yet',
                    description: 'Create your first volunteer event and start making an impact in your community'
                };
        }
    };
    // Get calculated values for rendering
    const stats = getStats();
    const filteredEvents = getFilteredEvents();
    const emptyState = getEmptyStateContent();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 h-24 flex items-center "  style={{paddingLeft: '80px', paddingRight: '80px'}}>
                <div className="w-full flex items-center justify-between">

                    {/* Left - Logo and title */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white-100 flex items-center justify-center">
                            <img
                                src={logo}
                                alt="Organization Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Organization Dashboard</h1>
                            <p className="text-base text-gray-500 mt-0.5">Swapno</p>
                        </div>
                    </div>
                    {/* Right - Status & actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Pending Verification
                        </div>
                        <button onClick={handleAnnouncements} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <Megaphone className="w-5 h-5 text-gray-600" />
                        </button>
                        <span onClick={handleAnnouncements} className="text-sm text-gray-700 font-medium cursor-pointer hover:text-gray-900">Announcements</span>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </header>
            {/* Main Content */}
            <main className="w-full  py-12"  style={{paddingLeft: '110px', paddingRight: '110px'}}>
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6" style={{marginBottom: '32px',paddingTop: '24px'}}>
                    {/* Active Events */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200" style={{borderLeft: '4px solid #3b82f6'}}>
                        <div className="flex items-start justify-between " style={{marginBottom: '32px'}}>
                            <span className="text-base font-medium text-gray-600">Active Events</span>
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-blue-900 mb-2">{stats.activeEvents}</div>
                        <p className="text-sm text-gray-500">Currently Recruiting Volunteers</p>
                    </div>

                    {/* Total Volunteers */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200" style={{borderLeft: '4px solid #00AF44'}}>
                        <div className="flex items-start justify-between " style={{marginBottom: '32px'}}>
                            <span className="text-sm font-medium text-gray-600">Total Volunteers</span>
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-green-500" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-green-600 mb-2">{stats.totalVolunteers}</div>
                        <p className="text-sm text-gray-500">Across all events</p>
                    </div>

                    {/* Events Created */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200" style={{borderLeft: '4px solid #00AF44'}}>
                        <div className="flex items-start justify-between " style={{marginBottom: '32px'}}>
                            <span className="text-sm font-medium text-gray-600">Events Created</span>
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-green-600 mb-2">{stats.totalEvents}</div>
                        <p className="text-sm text-gray-500">Lifetime Total</p>
                    </div>
                </div>

                {/* Manage Events Section */}

                {/* Header */}
                <div className="px-8 py-6  flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900" style={{marginBottom: '2px'}}>Manage Events</h2>
                        <p className="text-sm text-gray-500 "  style={{marginBottom: '32px'}}>Create and track your volunteer opportunities</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowCreateModal(true);
                        }}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-md"style={{paddingRight: '10px'}}
                    >
                        <Plus className="w-6 h-6" />
                        Create Event
                    </button>

                </div>


                {/* Tabs */}
                <div className="flex gap-8 px-8 " style={{paddingLeft: '48px', marginTop: '32px',marginBottom: '12px'}} >
                    <div className="inline-flex gap-5 p-1 bg-gray-100 rounded-lg border border-gray-200">
                        {['active', 'pending', 'completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`h-9 px-6 py-5 text-base font-semibold transition-colors rounded-lg border ${
                                    activeTab === tab
                                        ? 'bg-white text-black-900 border-white'
                                        : 'bg-gray text-gray border-white'
                                }`}
                            >
                                {tab === 'active' ? 'Active' : tab === 'pending' ? 'Pending Approval' : 'Completed'}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 " >
                    {/* Event Cards or Empty State */}
                    <div className="h-60 px-8 py-8">
                        {filteredEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEvents.map((event) => (
                                    <div key={event.id} className="bg-white rounded-xl border-2 border-blue-400 hover:shadow-md transition-shadow" style={{padding: '24px'}}>
                                        {/* Event Header */}
                                        <div className="flex items-start justify-between" style={{marginBottom: '16px', paddingLeft: '4px', paddingRight: '4px'}}>
                                            <h3 className="text-xl font-bold text-gray-900">{event.eventName}</h3>
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                                                event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    event.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                {event.status}
            </span>
                                        </div>

                                        {/* Volunteers Progress */}
                                        <div style={{marginBottom: '12px', paddingLeft: '4px', paddingRight: '4px'}}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Users className="w-4 h-4" />
                                                    <span>Volunteers</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">
                    {event.volunteersRegistered} / {event.volunteersNeeded}
                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                                    style={{width: `${(event.volunteersRegistered / event.volunteersNeeded) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Event Details */}
                                        <div className="space-y-2" style={{marginBottom: '12px', paddingLeft: '4px', paddingRight: '4px'}}>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-blue-500" />
                                                <span>{formatDate(event.date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{event.startTime} - {event.endTime}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        </div>

                                        {/* View Details Button */}
                                        <div className="flex justify-center" style={{paddingLeft: '4px', paddingRight: '4px'}}>
                                            <button className="w-3/4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mx-auto">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View Details & Manage
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-12">
                                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center" style={{marginBottom: '16px'}}>
                                    <Calendar className="w-7 h-7 text-blue-500" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900">
                                    {emptyState.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-5 max-w-sm" style={{marginBottom: '12px'}}>
                                    {emptyState.description}
                                </p>
                                {activeTab === 'active' && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowCreateModal(true);
                                        }}
                                        className="flex items-center gap-2 px-10 py-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                                    >
                                        <Plus className="w-8 h-8" />
                                        Create Event
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0   bg-opacity-2 flex items-center justify-center z-50 p-4" onClick={(e) => {
                    if (e.target === e.currentTarget) setShowCreateModal(false);
                }}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl  h-[95vh] overflow-y-auto" style={{paddingLeft: '15px', paddingRight: '15px', marginBottom: '20px'}} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-8 border-b border-gray-200 sticky top-0 bg-white" style={{marginBottom: '20px'}}>
                            <div className="flex items-center gap-2">
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Calendar
                                        className="w-12 h-12 rounded-xl
                                     bg-gradient-to-r from-[#0072c5] to-[#00c57b]"
                                    />

                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                        Create New Event
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Post a new volunteer opportunity for your organization
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2" style={{marginTop: '12px'}}>
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    name="eventName"
                                    value={formData.eventName}
                                    onChange={handleInputChange}
                                    className=" w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{marginBottom: '16px'}}
                                    placeholder="Enter event name"
                                />
                            </div>

                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className=" w-full  px-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{paddingRight: '16px', marginBottom: '16px'}}
                                    placeholder="Describe your volunteer event"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className=" h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{marginBottom: '16px'}}
                                    />
                                </div>

                                <CustomTimePicker
                                    label="Start Time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    required
                                />

                                <CustomTimePicker
                                    label="End Time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full  h-10 px-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{marginBottom: '16px'}}
                                    placeholder="Event location"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className=" h-10 px-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{marginBottom: '16px'}}
                                    >
                                        <option value="">Select category</option>
                                        <option value="education">Education</option>
                                        <option value="environment">Environment</option>
                                        <option value="health">Health</option>
                                        <option value="community">Community</option>
                                        <option value="other">Distribution</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                        Volunteers Needed *
                                    </label>
                                    <style>
                                        {`
                                            input[type="number"]::-webkit-inner-spin-button,
                                            input[type="number"]::-webkit-outer-spin-button {
                                                opacity: 1;
                                                height: 68px;
                                                width: 20px;
                                                 cursor: pointer;
                                            }
                                        `}
                                    </style>
                                    <input
                                        type="number"
                                        name="volunteersNeeded"
                                        value={formData.volunteersNeeded}
                                        onChange={handleInputChange}
                                        min="1"
                                        className=" h-10 px-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{marginBottom: '16px'}}
                                        placeholder="Number of volunteers"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2">
                                    Requirements
                                </label>
                                <textarea
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="  w-full px-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{marginBottom: '16px'}}
                                    placeholder="Any specific requirements or skills needed"
                                />
                            </div>

                            <div className="flex justify-center gap-3 pt-4">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className=" px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Create Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizerDashboard;