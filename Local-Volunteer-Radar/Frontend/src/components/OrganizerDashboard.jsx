import React, { useState } from 'react';
import { Calendar, Users, TrendingUp, Megaphone, LogOut, Plus, X } from 'lucide-react';
import logo from "../assets/logo.png";
const OrganizerDashboard = () => {
    const [activeTab, setActiveTab] = useState('active');
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Event Created:', formData);
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

    const handleLogout = () => {
        console.log('Logging out...');
    };

    const handleAnnouncements = () => {
        console.log('Navigating to announcements...');
    };

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

    const emptyState = getEmptyStateContent();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 h-32 flex items-center "  style={{paddingLeft: '80px', paddingRight: '80px'}}>
                <div className="w-full flex items-center justify-between">

                    {/* Left - Logo and title */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-blue-100 flex items-center justify-center">
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
            <main className="w-full  py-12"  style={{paddingLeft: '80px', paddingRight: '80px'}}>
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6" style={{marginBottom: '24px'}}>
                    {/* Active Events */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200" style={{borderLeft: '4px solid #3b82f6'}}>
                        <div className="flex items-start justify-between " style={{marginBottom: '32px'}}>
                            <span className="text-base font-medium text-gray-600">Active Events</span>
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-blue-900 mb-2">0</div>
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
                        <div className="text-4xl font-bold text-green-600 mb-2">0</div>
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
                        <div className="text-4xl font-bold text-green-600 mb-2">0</div>
                        <p className="text-sm text-gray-500">Lifetime Total</p>
                    </div>
                </div>

                {/* Manage Events Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 " >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900" style={{marginBottom: '8px'}}>Manage Events</h2>
                            <p className="text-sm text-gray-500 "  style={{marginBottom: '32px'}}>Create and track your volunteer opportunities</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowCreateModal(true);
                            }}
                            className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-md"
                        >
                            <Plus className="w-6 h-6" />
                            Create Event
                        </button>

                    </div>

                    {/* Tabs */}
                    <div className="flex gap-8 px-8 border-b border-gray-200" style={{paddingLeft: '48px', marginBottom: '32px'}} >
                        {['active', 'pending', 'completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 text-sm font-semibold transition-colors relative ${
                                    activeTab === tab
                                        ? 'text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab === 'active' ? 'Active' : tab === 'pending' ? 'Pending Approval' : 'Completed'}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Empty State */}
                    <div className="px-8 py-20">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center "  style={{marginBottom: '16px'}}>
                                <Calendar className="w-7 h-7 text-blue-500" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 ">
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
                    </div>
                </div>
            </main>

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0   bg-opacity-2 flex items-center justify-center z-50 p-4" onClick={(e) => {
                    if (e.target === e.currentTarget) setShowCreateModal(false);
                }}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-150 max-h-[95vh] overflow-y-auto" style={{paddingLeft: '10px', marginBottom: '12px'}} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-8 border-b border-gray-200 sticky top-0 bg-white">
                            <h2 className="text-3xl font-bold text-gray-900"  style={{paddingLeft: '10px', marginBottom: '12px'}}>Create New Event</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2" >
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    name="eventName"
                                    value={formData.eventName}
                                    onChange={handleInputChange}
                                    className=" px-8,py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    rows="5"
                                    className=" w-120 px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe your volunteer event"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                        Start Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                        End Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>


                            </div>                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    rows="3"
                                    className=" w-120 px-10 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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