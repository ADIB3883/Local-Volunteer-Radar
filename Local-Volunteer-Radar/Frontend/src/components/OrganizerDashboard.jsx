import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, TrendingUp, Megaphone, LogOut, Plus, X, MessageCircle } from 'lucide-react';
import logo from "../assets/logo.png";
import Modal from './Modal';
import ActiveEventsOrganizerModal from './ActiveEventsOrganizerModal';
import TotalVolunteersOrganizerModal from './TotalVolunteersOrganizerModal';
import EventsCreatedModal from './EventsCreatedModal';
import MessagesTab from './MessageTab';
import AlertModal from "./AlertModal";
import axios from "axios";

const API_URL = 'http://localhost:5000/api/events';

const OrganizerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');
    const [modalOpen, setModalOpen] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [organizerId, setOrganizerId] = useState(null);
    const [organizerName, setOrganizerName] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMessagesModal, setShowMessagesModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        icon: 'info',
        buttonText: 'Got it',
        buttonColor: 'bg-blue-500 hover:bg-blue-600',
        onCloseRedirect: null
    });
    const [formData, setFormData] = useState({
        eventName: '',
        description: '',
        startdate: '',
        enddate: '',
        location: '',
        volunteersNeeded: '',
        category: '',
        startTime: '',
        endTime: '',
        requirements: ''
    });

    // Show alert helper function
    const showAlert = (title, message, icon = 'info', buttonText = 'Got it', buttonColor = 'bg-blue-500 hover:bg-blue-600', onCloseRedirect = null) => {
        setAlertConfig({
            isOpen: true,
            title,
            message,
            icon,
            buttonText,
            buttonColor,
            onCloseRedirect
        });
    };

    const closeAlert = () => {
        const redirect = alertConfig.onCloseRedirect;
        setAlertConfig({
            isOpen: false,
            title: '',
            message: '',
            icon: 'info',
            buttonText: 'Got it',
            buttonColor: 'bg-blue-500 hover:bg-blue-600',
            onCloseRedirect: null
        });
        if (redirect) {
            redirect();
        }
    };

    // Check authentication and get organizer data
    useEffect(() => {
        const userStr = localStorage.getItem('loggedInUser');
        console.log('User from localStorage:', userStr);

        if (!userStr) {
            console.log('No user found, redirecting to login');
            navigate('/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            console.log('Parsed user:', user);

            if (user.role !== 'organizer') {
                console.log('User is not organizer, role:', user.role);
                showAlert(
                    'Access Denied',
                    'This page is for organizers only.',
                    'error',
                    'Go to Login',
                    'bg-red-500 hover:bg-red-600',
                    () => navigate('/login')
                );
                return;
            }

            if (user.id) {
                setOrganizerId(user.id);
                setOrganizerName(user.name || 'Organization');
                console.log('Organizer ID set:', user.id);
            } else {
                console.log('No user ID found');
                showAlert(
                    'Authentication Error',
                    'User ID not found. Please login again.',
                    'error',
                    'Go to Login',
                    'bg-red-500 hover:bg-red-600',
                    () => navigate('/login')
                );
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
        }
    }, [navigate]);

    // Fetch events when organizerId is available
    useEffect(() => {
        if (organizerId) {
            fetchEvents();
        }
    }, [organizerId]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            console.log('Fetching events for organizer:', organizerId);
            const response = await axios.get(`${API_URL}/organizer/${organizerId}`);
            console.log('Events fetched:', response.data);
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
            if (error.response?.status === 404) {
                setEvents([]);
            } else {
                showAlert(
                    'Error',
                    'Failed to load events. Please try again.',
                    'error',
                    'OK',
                    'bg-red-500 hover:bg-red-600'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        // Required fields validation
        const requiredFields = ['eventName', 'description', 'startdate', 'enddate', 'location', 'volunteersNeeded', 'category', 'startTime', 'endTime'];
        for (const f of requiredFields) {
            const v = formData[f];
            if (v === undefined || v === null || String(v).trim() === '') {
                showAlert(
                    'Incomplete Form',
                    'Please fill in all required fields.',
                    'warning',
                    'OK',
                    'bg-orange-500 hover:bg-orange-600'
                );
                return;
            }
        }

        if (isNaN(Number(formData.volunteersNeeded)) || Number(formData.volunteersNeeded) <= 0) {
            showAlert(
                'Invalid Input',
                'Please enter a valid number of volunteers needed.',
                'warning',
                'OK',
                'bg-orange-500 hover:bg-orange-600'
            );
            return;
        }

        // Date validation
        if (!formData.startdate || !formData.enddate) {
            showAlert(
                'Invalid Date',
                'Please provide both start and end dates.',
                'warning',
                'OK',
                'bg-orange-500 hover:bg-orange-600'
            );
            return;
        }

        const startTimePart = formData.startTime || '00:00';
        const endTimePart = formData.endTime || '00:00';
        const startDateTime = new Date(`${formData.startdate}T${startTimePart}`);
        const endDateTime = new Date(`${formData.enddate}T${endTimePart}`);

        if (endDateTime < startDateTime) {
            showAlert(
                'Invalid Date Range',
                'The event end must come after the start.',
                'warning',
                'OK',
                'bg-orange-500 hover:bg-orange-600'
            );
            return;
        }

        if (formData.startdate === formData.enddate) {
            const diffMinutes = (endDateTime - startDateTime) / 60000;
            if (diffMinutes < 15) {
                showAlert(
                    'Invalid Time Range',
                    'When start and end date are the same, end time must be at least 15 minutes after start time.',
                    'warning',
                    'OK',
                    'bg-orange-500 hover:bg-orange-600'
                );
                return;
            }
        }

        try {
            const newEvent = {
                organizerId: organizerId,
                ...formData,
            };

            console.log('Creating event:', newEvent);
            const response = await axios.post(API_URL, newEvent);
            console.log('Event created:', response.data);

            // Refresh events list
            await fetchEvents();

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
                endTime: '',
                requirements: ''
            });

            // Show success alert with slight delay
            setTimeout(() => {
                showAlert(
                    'Success!',
                    'Event created successfully!',
                    'success',
                    'Got it',
                    'bg-green-500 hover:bg-green-600'
                );
            }, 300);
        } catch (error) {
            console.error('Error creating event:', error);
            showAlert(
                'Error',
                error.response?.data?.message || 'Failed to create event. Please try again.',
                'error',
                'OK',
                'bg-red-500 hover:bg-red-600'
            );
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        navigate('/login');
    };

    const handleAnnouncements = () => {
        navigate('/announcements');
    };

    const handleMessages = () => {
        setShowMessagesModal(true);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    const getFilteredEvents = () => {
        return events.filter(event => event.status === activeTab);
    };

    const getStats = () => {
        const activeEvents = events.filter(e => e.status === 'active').length;
        const totalVolunteers = events.reduce((sum, e) => sum + (e.volunteersRegistered || 0), 0);
        const totalEvents = events.length;

        return { activeEvents, totalVolunteers, totalEvents };
    };

    const getEmptyStateContent = () => {
        switch (activeTab) {
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

    const handleViewDetails = (eventId) => {
        navigate(`/event-details/${eventId}`);
    };

    if (loading || !organizerId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    const stats = getStats();
    const filteredEvents = getFilteredEvents();
    const emptyState = getEmptyStateContent();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 h-24 flex items-center" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
                <div className="w-full flex items-center justify-between">
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
                            <p className="text-base text-gray-500 mt-0.5">{organizerName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Active
                        </div>

                        <button onClick={handleMessages} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <MessageCircle className="w-5 h-5 text-gray-600" />
                        </button>
                        <span onClick={handleMessages} className="text-sm text-gray-700 font-medium cursor-pointer hover:text-gray-900">Messages</span>

                        <button onClick={handleAnnouncements} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <Megaphone className="w-5 h-5 text-gray-600" />
                        </button>
                        <span onClick={handleAnnouncements} className="text-sm text-gray-700 font-medium cursor-pointer hover:text-gray-900">Announcements</span>

                        <button onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900 transition-colors">
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full py-12" style={{ paddingLeft: '110px', paddingRight: '110px' }}>
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '32px', paddingTop: '24px' }}>
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-200 cursor-pointer"
                        style={{ borderLeft: '4px solid #3b82f6' }}
                        onClick={() => setModalOpen('active-events')}
                    >
                        <div className="flex items-start justify-between" style={{ marginBottom: '32px' }}>
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
                        style={{ borderLeft: '4px solid #00AF44' }}
                        onClick={() => setModalOpen('total-volunteers')}
                    >
                        <div className="flex items-start justify-between" style={{ marginBottom: '32px' }}>
                            <span className="text-sm font-medium text-gray-600">Total Volunteers</span>
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-green-500" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-green-600 mb-2">{stats.totalVolunteers}</div>
                        <p className="text-sm text-gray-500">Across all events</p>
                    </div>

                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-200 cursor-pointer"
                        style={{ borderLeft: '4px solid #00AF44' }}
                        onClick={() => setModalOpen('events-created')}
                    >
                        <div className="flex items-start justify-between" style={{ marginBottom: '32px' }}>
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
                <div className="px-8 py-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900" style={{ marginBottom: '2px' }}>Manage Events</h2>
                        <p className="text-sm text-gray-500" style={{ marginBottom: '32px' }}>Create and track your volunteer opportunities</p>
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
                <div className="flex gap-8 px-8" style={{ paddingLeft: '48px', marginTop: '32px', marginBottom: '12px' }}>
                    <div className="inline-flex gap-5 p-1 bg-gray-100 rounded-lg border border-gray-200">
                        {['active', 'pending', 'completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`h-9 px-6 cursor-pointer text-base font-semibold transition-colors rounded-lg border ${activeTab === tab
                                    ? 'bg-white text-black-900 border-white'
                                    : 'bg-gray text-gray border-white'
                                }`}
                            >
                                {tab === 'active' ? 'Active' : tab === 'pending' ? 'Pending Approval' : 'Completed'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="h-80 px-8 py-8">
                        {filteredEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEvents.map((event) => {

                                    const approvedCount = (event.registrations || []).filter(r => r.status === 'approved').length;

                                    return (
                                    <div key={event._id} className="bg-white rounded-xl border-2 border-blue-400 hover:shadow-md transition-shadow" style={{ padding: '24px' }}>
                                        <div className="flex items-start justify-between" style={{ marginBottom: '16px', paddingLeft: '4px', paddingRight: '4px' }}>
                                            <h3 className="text-xl font-bold text-gray-900">{event.eventName}</h3>
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                event.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                                {event.status}
                                            </span>
                                        </div>

                                        <div style={{ marginBottom: '12px', paddingLeft: '4px', paddingRight: '4px' }}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Users className="w-4 h-4" />
                                                    <span>Volunteers</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {approvedCount || 0} / {event.volunteersNeeded}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${((approvedCount || 0) / event.volunteersNeeded) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="space-y-2" style={{ marginBottom: '12px', paddingLeft: '4px', paddingRight: '4px' }}>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-blue-500" />
                                                <span> {`${new Date(event.startdate).toLocaleDateString('en-GB')} - ${new Date(event.enddate).toLocaleDateString('en-GB')}`}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>
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
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-center" style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                                            <button
                                                onClick={() => handleViewDetails(event._id)}
                                                className="w-3/4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mx-auto"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View Details & Manage
                                            </button>
                                        </div>
                                    </div>
                                )}
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-6">
                                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center" style={{ marginBottom: '24px' }}>
                                    <Calendar className="w-7 h-7 text-blue-500" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900">
                                    {emptyState.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-5 max-w-sm" style={{ marginBottom: '12px' }}>
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
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[95vh] overflow-y-auto" style={{paddingLeft: '15px', paddingRight: '15px', marginBottom: '20px'}} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-8 border-b border-gray-200 sticky top-0 bg-white" style={{marginBottom: '20px'}}>
                            <div className="flex items-center gap-2">
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-12 h-12 text-blue-500" />
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
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    style={{marginBottom: '16px'}}
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
                                    className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    style={{marginBottom: '16px'}}
                                    placeholder="Describe your volunteer event"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    style={{marginBottom: '16px'}}
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
                                        className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{marginBottom: '16px'}}
                                    >
                                        <option value="">Select category</option>
                                        <option value="education">Education</option>
                                        <option value="environment">Environment</option>
                                        <option value="health">Health</option>
                                        <option value="community">Community</option>
                                        <option value="distribution">Distribution</option>
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
                                        className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{marginBottom: '16px'}}
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    style={{marginBottom: '16px'}}
                                    placeholder="Any specific requirements or skills needed"
                                />
                            </div>

                            <div className="flex justify-center gap-3 pt-4">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
                            <MessagesTab currentUser={{ email: organizerId, role: "organizer", fullName: organizerName }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Alert Modal - positioned top-right like toast notification */}
            <div className="fixed top-4 right-4 z-[100]">
                <AlertModal
                    isOpen={alertConfig.isOpen}
                    onClose={closeAlert}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    icon={alertConfig.icon}
                    buttonText={alertConfig.buttonText}
                    buttonColor={alertConfig.buttonColor}
                    onCloseRedirect={alertConfig.onCloseRedirect}
                />
            </div>
        </div>
    );
};

export default OrganizerDashboard;