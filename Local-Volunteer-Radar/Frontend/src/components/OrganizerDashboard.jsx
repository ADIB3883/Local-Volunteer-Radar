import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, TrendingUp, Megaphone, LogOut, Plus,X,MessageCircle} from 'lucide-react';
import logo from "../assets/logo.png";
import Modal from './Modal';
import ActiveEventsOrganizerModal from './ActiveEventsOrganizerModal';
import TotalVolunteersOrganizerModal from './TotalVolunteersOrganizerModal';
import EventsCreatedModal from './EventsCreatedModal';
import MessagesTab from './MessageTab';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');
const OrganizerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pending');
    const [modalOpen, setModalOpen] = useState(null);

    const [events, setEvents] = useState([]);

    // Fetch organizer's events from database and poll for updates
    React.useEffect(() => {
        const fetchOrganizerEvents = async () => {
            try {
                const organizerId = "org_123";
                const response = await fetch(`http://localhost:5000/api/events/organizer/${organizerId}`);
                const data = await response.json();
                
                if (data.events && Array.isArray(data.events)) {
                    setEvents(data.events);
                }
            } catch (error) {
                console.error('Error fetching organizer events:', error);
                setEvents([]);
            }
        };

        fetchOrganizerEvents();
        
        // Poll for updates every 5 seconds to reflect volunteer registrations
        const interval = setInterval(fetchOrganizerEvents, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMessagesModal, setShowMessagesModal] = useState(false);
    const [formData, setFormData] = useState({
        eventName: '',
        description: '',
        startdate: '',
        enddate: '',
        location: '',
        volunteersNeeded: '',
        category: '',
        startTime: '',
        endTime:'',
        requirements: ''
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = () => {
        // Required fields validation (everything except `requirements`)
        const requiredFields = ['eventName','description','startdate','enddate','location','volunteersNeeded','category','startTime','endTime'];
        for (const f of requiredFields) {
            const v = formData[f];
            if (v === undefined || v === null || String(v).trim() === '') {
                alert('Fill all necessary information');
                return;
            }
        }
        // ensure volunteersNeeded is a positive number
        if (isNaN(Number(formData.volunteersNeeded)) || Number(formData.volunteersNeeded) <= 0) {
            alert('Fill all necessary information');
            return;
        }

        // Validation: ensure end date is same or after start date.
        // If dates are equal, ensure end time is at least 15 minutes after start time.
        if (!formData.startdate || !formData.enddate) {
            alert('Please provide both start and end dates.');
            return;
        }

        // Build full ISO-like datetimes using provided times (fallback to 00:00 when missing).
        const startTimePart = formData.startTime || '00:00';
        const endTimePart = formData.endTime || '00:00';
        const startDateTime = new Date(`${formData.startdate}T${startTimePart}`);
        const endDateTime = new Date(`${formData.enddate}T${endTimePart}`);

        if (endDateTime < startDateTime) {
            alert('The event end must come after the start. If the end is in the same day, pick an end time at least 15 minutes later.');
            return;
        }

        if (formData.startdate === formData.enddate) {
            const diffMinutes = (endDateTime - startDateTime) / 60000; // milliseconds -> minutes
            if (diffMinutes < 15) {
                alert('When start and end date are the same, end time must be at least 15 minutes after start time.');
                return;
            }
        }

        const organizerId = "org_123";

        const newEvent = {
            title: formData.eventName,
            organizerId: organizerId,
            description: formData.description,
            tags: [formData.category],
            date: formData.startdate,
            time: formData.startTime,
            location: formData.location,
            distance: 0,
            requirements: formData.requirements || "",
            volunteersNeeded: parseInt(formData.volunteersNeeded) || 10
        };

        // Save to database
        fetch('http://localhost:5000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEvent)
        })
        .then(res => res.json())
        .then(data => {
            if (data.event) {
                // Refresh events list from database instead of adding local copy
                const organizerId = "org_123";
                fetch(`http://localhost:5000/api/events/organizer/${organizerId}`)
                    .then(res => res.json())
                    .then(refreshData => {
                        if (refreshData.events) {
                            setEvents(refreshData.events);
                        }
                    })
                    .catch(err => console.error('Error refreshing events:', err));
                alert('Event created successfully! Pending admin approval.');
            } else {
                alert('Error creating event: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(err => {
            console.error('Error creating event:', err);
            alert('Error creating event. Please try again.');
        })
        .finally(() => {
            setShowCreateModal(false);
            setFormData({
                eventName: '',
                description: '',
                startdate: '',
                enddate: '',
                location: '',
                volunteersNeeded: '',
                category: '',
                startTime: '',
                endTime:'',
                requirements: ''
            });
        });
    };
    const handleLogout = () => {
        navigate('/login');
    };
    const handleAnnouncements = () => {
        navigate('/announcements');
    };
    const handleMessages = () => {
        setShowMessagesModal(true);
    };
    const handleCloseRegistrations = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/close-registrations`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            
            if (response.ok) {
                alert('Registrations closed! Event sent to admin for approval.');
                // Refresh events list
                const organizerId = "org_123";
                const refreshResponse = await fetch(`http://localhost:5000/api/events/organizer/${organizerId}`);
                const refreshData = await refreshResponse.json();
                if (refreshData.events) {
                    setEvents(refreshData.events);
                }
            } else {
                alert('Error: ' + (data.message || 'Failed to close registrations'));
            }
        } catch (error) {
            console.error('Error closing registrations:', error);
            alert('Error closing registrations. Please try again.');
        }
    };
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };
    const getFilteredEvents = () => {
        const organizerId = "org_123";
        return events.filter(event => {
            if (event.organizerId !== organizerId) return false;
            
            // Categorize based on isPending and isApproved flags
            if (activeTab === 'pending') {
                // Waiting for admin approval: isPending=true, isApproved=false
                return event.isPending === true && event.isApproved === false;
            } else if (activeTab === 'active') {
                // Admin approved: isPending=false, isApproved=true
                return event.isPending === false && event.isApproved === true;
            } else if (activeTab === 'completed') {
                // Admin rejected or event date passed: isPending=false, isApproved=false
                return event.isPending === false && event.isApproved === false;
            }
            return false;
        });
    };
    const getStats = () => {
        const organizerId = "org_123"; // Same organizerId
        const myEvents = events.filter(e => e.organizerId === organizerId);

        // Count active events: isPending=false AND isApproved=true
        const activeEvents = myEvents.filter(e => e.isPending === false && e.isApproved === true).length;
        const totalVolunteers = myEvents.reduce((sum, e) => sum + (e.volunteersRegistered || 0), 0);
        const totalEvents = myEvents.length;

        return { activeEvents, totalVolunteers, totalEvents };
    };
    const getEmptyStateContent = () => {
        switch(activeTab) {
            case 'pending':
                return {
                    title: 'No pending events',
                    description: 'Events you created will appear here while waiting for admin approval'
                };
            case 'active':
                return {
                    title: 'No active events yet',
                    description: 'Create your first volunteer event and start making an impact in your community'
                };
            case 'completed':
                return {
                    title: 'No completed events yet',
                    description: 'Events that have finished or been rejected will appear here'
                };
            default:
                return {
                    title: 'No events',
                    description: 'Start creating events to get started'
                };
        }
    };
    // View Details Navigate
    const handleViewDetails = (eventId) => {
        navigate(`/event-details/${eventId}`);
    };
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

                        {/* MESSAGES BUTTON - NEW */}
                        <button onClick={handleMessages} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <MessageCircle className="w-5 h-5 text-gray-600" />
                        </button>
                        <span onClick={handleMessages} className="text-sm text-gray-700 font-medium cursor-pointer hover:text-gray-900">Messages</span>

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
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-200 cursor-pointer"
                        style={{borderLeft: '4px solid #3b82f6'}}
                        onClick={() => setModalOpen('active-events')}
                    >
                        <div className="flex items-start justify-between " style={{marginBottom: '32px'}}>
                            <span className="text-base font-medium text-gray-600">Active Events</span>
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-blue-900 mb-2">{stats.activeEvents}</div>
                        <p className="text-sm text-gray-500">Currently Recruiting Volunteers</p>
                    </div>

                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-200 cursor-pointer"
                        style={{borderLeft: '4px solid #00AF44'}}
                        onClick={() => setModalOpen('total-volunteers')}
                    >
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
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-200 cursor-pointer"
                        style={{borderLeft: '4px solid #00AF44'}}
                        onClick={() => setModalOpen('events-created')}
                    >
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

                <Modal
                    isOpen={modalOpen === 'active-events'}
                    onClose={() => setModalOpen(null)}
                    title="Active Events"
                >
                    <ActiveEventsOrganizerModal events={events} />
                </Modal>

                <Modal
                    isOpen={modalOpen === 'total-volunteers'}
                    onClose={() => setModalOpen(null)}
                    title="Total Volunteers"
                >
                    <TotalVolunteersOrganizerModal events={events} />
                </Modal>

                <Modal
                    isOpen={modalOpen === 'events-created'}
                    onClose={() => setModalOpen(null)}
                    title="Events Created"
                >
                    <EventsCreatedModal events={events} />
                </Modal>

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
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold leading-none shadow-md"
                    >
                        <Plus className="w-6 h-6" />
                        Create Event
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 px-8 " style={{paddingLeft: '48px', marginTop: '32px',marginBottom: '12px'}} >
                    <div className="inline-flex gap-5 p-1 bg-gray-100 rounded-lg border border-gray-200">
                        {['pending', 'active', 'completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`h-9 px-6  text-base font-semibold transition-colors rounded-lg border ${
                                    activeTab === tab
                                        ? 'bg-white text-black-900 border-white'
                                        : 'bg-gray text-gray border-white'
                                }`}
                            >
                                {tab === 'pending' ? 'Pending Approval' : tab === 'active' ? 'Active' : 'Completed'}

                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 " >
                    {/* Event Cards or Empty State */}
                    <div className="h-80 px-8 py-8">
                        {filteredEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEvents.map((event) => {
                                    const eventStatus = event.isPending ? 'pending' : (event.isApproved ? 'active' : 'completed');
                                    return (
                                    <div key={event.eventId || event.id} className="bg-white rounded-xl border-2 border-blue-400 hover:shadow-md transition-shadow" style={{padding: '24px'}}>
                                        {/* Event Header */}
                                        <div className="flex items-start justify-between" style={{marginBottom: '16px', paddingLeft: '4px', paddingRight: '4px'}}>
                                            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                                                eventStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    eventStatus === 'active' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                                                {eventStatus}
                                            </span>
                                        </div>

                                        {/* Volunteers Progress - Placeholder since DB doesn't track yet */}
                                        <div style={{marginBottom: '12px', paddingLeft: '4px', paddingRight: '4px'}}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Users className="w-4 h-4" />
                                                    <span>Volunteers</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">
                    {event.volunteersRegistered || 0} / {event.volunteersNeeded || 10}
                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                                    style={{width: `${((event.volunteersRegistered || 0) / (event.volunteersNeeded || 10)) * 100}%`}}
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
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{display: 'flex', gap: '8px', paddingLeft: '4px', paddingRight: '4px'}}>
                                            {eventStatus === 'pending' && !event.registrationsClosed && (
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Close registrations and send to admin for approval?')) {
                                                            handleCloseRegistrations(event.eventId);
                                                        }
                                                    }}
                                                    className="flex-1 py-2 border border-orange-300 rounded-lg text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors">
                                                    Close & Submit
                                                </button>
                                            )}
                                            {eventStatus === 'active' && (
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Close this event and move to completed?')) {
                                                            fetch(`http://localhost:5000/api/events/${event.id || event.eventId}/complete`, {
                                                                method: 'PUT',
                                                                headers: { 'Content-Type': 'application/json' }
                                                            })
                                                            .then(res => res.json())
                                                            .then(data => {
                                                                fetchOrganizerEvents();
                                                            })
                                                            .catch(err => console.error('Error closing event:', err));
                                                        }
                                                    }}
                                                    className="flex-1 py-2 border border-green-300 rounded-lg text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors">
                                                    Close Event
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleViewDetails(event.eventId || event.id)}
                                                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-6">
                                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center" style={{marginBottom: '24px'}}>
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
                                        className="flex items-center gap-2 px-5 py-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" />
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
                <div className="fixed top-0 bottom-0 left-0 right-0 bg-[#000000]/40 flex items-center justify-center z-50 p-4" onClick={(e) => {
                    if (e.target === e.currentTarget) setShowCreateModal(false);
                }}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl  h-[95vh] overflow-y-auto" style={{paddingLeft: '15px', paddingRight: '15px', marginBottom: '20px'}} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-8 border-b border-gray-200 sticky top-0 bg-white" style={{marginBottom: '20px'}}>
                            <div className="flex items-center gap-2">
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Calendar
                                        className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#0072c5] to-[#00c57b]"
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
                            <div className="grid grid-cols-2 gap-4">
                                {/* First Row: Start Date and Start Time */}
                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="startdate"
                                        value={formData.startdate}
                                        onChange={handleInputChange}
                                        className="w-full h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{marginBottom: '16px'}}
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                        Start Time *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="startTimeInput"
                                            type="time"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            style={{marginBottom: '16px'}}
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const input = document.getElementById('startTimeInput');
                                                if (input.showPicker) {
                                                    input.showPicker();
                                                } else {
                                                    input.focus();
                                                }
                                            }}
                                            className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Second Row: End Date and End Time */}
                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="enddate"
                                        value={formData.enddate}
                                        onChange={handleInputChange}
                                        className="w-full h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{marginBottom: '16px'}}
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                        End Time *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="endTimeInput"
                                            type="time"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            style={{marginBottom: '16px'}}
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const input = document.getElementById('endTimeInput');
                                                if (input.showPicker) {
                                                    input.showPicker();
                                                } else {
                                                    input.focus();
                                                }
                                            }}
                                            className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
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

            {/* Messages Modal */}
            {showMessagesModal && (
                <div className="fixed top-0 bottom-0 left-0 right-0 bg-[#000000]/40 flex items-center justify-center z-50 p-4" onClick={(e) => {
                    if (e.target === e.currentTarget) setShowMessagesModal(false);
                }}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
                            <button
                                onClick={() => setShowMessagesModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6">
                            <MessagesTab currentUser={{ email: "org_123", role: "organizer", fullName: "Swapno" }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizerDashboard;

