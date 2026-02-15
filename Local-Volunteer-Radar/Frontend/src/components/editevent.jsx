import React, { useState, useEffect } from 'react';
import { Calendar, X, Clock } from 'lucide-react';

// Success Notification Popup Component
const SuccessNotification = ({ show, message, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div
            className={`fixed top-6 left-6 bg-white rounded-lg shadow-2xl p-4 flex items-center gap-3 border-l-4 border-green-500 transform transition-all duration-500 z-[60] ${
                show ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
        >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl font-bold leading-none">✓</span>
            </div>
            <div>
                <p className="font-bold text-gray-900">{message}</p>
            </div>
        </div>
    );
};

// Custom Time Picker Component
const CustomTimePicker = ({ label, value, onChange, name, required = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempHour, setTempHour] = useState('12');
    const [tempMinute, setTempMinute] = useState('00');
    const [tempPeriod, setTempPeriod] = useState('AM');
    const [inputValue, setInputValue] = useState('');
    const inputRef = React.useRef(null);

    const openPicker = () => {
        if (value) {
            const [h, m] = value.split(':');
            const hour = parseInt(h);
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
        setIsOpen(true);
    };

    const handleConfirm = () => {
        let hour = parseInt(tempHour);
        if (tempPeriod === 'AM') {
            if (hour === 12) hour = 0;
        } else {
            if (hour !== 12) hour += 12;
        }
        const formattedTime = `${hour.toString().padStart(2, '0')}:${tempMinute}`;
        onChange({ target: { name, value: formattedTime } });
        setIsOpen(false);
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/;
        const match = val.match(timeRegex);
        if (match) {
            let hour = parseInt(match[1]);
            const minute = match[2];
            const period = match[3] ? match[3].toUpperCase() : null;
            if (hour >= 0 && hour <= 23 && parseInt(minute) >= 0 && parseInt(minute) <= 59) {
                let finalHour = hour;
                if (period) {
                    if (period === 'AM' && hour === 12) finalHour = 0;
                    else if (period === 'PM' && hour !== 12) finalHour = hour + 12;
                } else if (hour >= 0 && hour <= 23) {
                    finalHour = hour;
                }
                const formattedTime = `${finalHour.toString().padStart(2, '0')}:${minute}`;
                onChange({ target: { name, value: formattedTime } });
            }
        }
    };

    const displayValue = value ? (() => {
        const [h, m] = value.split(':');
        const hour = parseInt(h);
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 ? 'AM' : 'PM';
        return `${displayHour}:${m} ${period}`;
    })() : '';

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    const modalPositionClass = name === 'endTime'
        ? 'fixed top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/2'
        : 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';

    return (
        <div className="relative">
            <label className="block text-base font-semibold text-gray-700 mb-2">
                {label} {required && '*'}
            </label>
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
                <button
                    type="button"
                    onClick={openPicker}
                    className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded transition-colors"
                >
                    <Clock className="w-5 h-5 text-gray-600" />
                </button>
            </div>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-pink-400 bg-opacity-50 z-50"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className={`${modalPositionClass} bg-white rounded-lg shadow-xl z-50 p-6 w-70`}>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800" style={{marginBottom: '4px'}}>Select Time</h3>
                        <div className="flex gap-2 mb-6">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{marginBottom: '4px'}}>Hour</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{marginBottom: '4px'}}>Minute</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2" style={{marginBottom: '4px'}}>Period</label>
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
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-center">
                            <span className="text-2xl font-semibold text-blue-700" style={{marginBottom: '4px'}}>
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

// EditEvent Component
const EditEvent = ({
                       isOpen,
                       onClose,
                       onUpdate,
                       eventData
                   }) => {
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [formData, setFormData] = useState({
        eventName: '',
        description: '',
        date: '',
        location: '',
        volunteersNeeded: '',
        category: '',
        startTime: '',
        endTime: '',
        requirements: ''
    });

    useEffect(() => {
        if (eventData) {
            setFormData({
                eventName: eventData.eventName || '',
                description: eventData.description || '',
                date: eventData.date || '',
                location: eventData.location || '',
                volunteersNeeded: eventData.volunteersNeeded || '',
                category: eventData.category || '',
                startTime: eventData.startTime || '',
                endTime: eventData.endTime || '',
                requirements: eventData.requirements || ''
            });
        }
    }, [eventData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onUpdate(formData);
        setShowSuccessPopup(true);

        // Close modal after showing success message
        setTimeout(() => {
            onClose();
            setShowSuccessPopup(false);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Success Notification Popup */}
            <SuccessNotification
                show={showSuccessPopup}
                message="Event updated successfully!"
                onClose={() => setShowSuccessPopup(false)}
            />

            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[95vh] overflow-y-auto"
                    style={{paddingLeft: '15px', paddingRight: '15px', marginBottom: '20px'}}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-8 border-b border-gray-200 sticky top-0 bg-white z-10" style={{marginBottom: '20px'}}>
                        <div className="flex items-center gap-2">
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                    Edit Event
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Update the details of your event
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
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
                                style={{paddingRight: '16px', marginBottom: '16px'}}
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
                                    className="w-full h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full h-10 px-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    className="w-full h-10 px-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    className="w-full h-10 px-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                style={{marginBottom: '16px'}}
                                placeholder="Any specific requirements or skills needed"
                            />
                        </div>

                        <div className="flex justify-center gap-3 pt-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Update Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Demo Preview Component
const EditEventPreview = () => {
    const [showModal, setShowModal] = useState(true);

    const sampleEventData = {
        eventName: 'Relief Distribution',
        description: 'Relief Distribution in Noakhali',
        date: '2025-12-25',
        location: '7/6, Kaiful, Noakhali',
        volunteersNeeded: '5',
        category: 'distribution',
        startTime: '18:00',
        endTime: '21:00',
        requirements: 'Crowd Management'
    };

    const handleUpdate = (formData) => {
        console.log('Updated Event Data:', formData);
        // Removed alert() - now using the custom popup
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit Event Modal Preview</h1>
                <p className="text-gray-600 mb-6">This is how the Edit Event modal looks</p>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Open Edit Event Modal
                </button>
            </div>

            <EditEvent
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onUpdate={handleUpdate}
                eventData={sampleEventData}
            />
        </div>
    );
};

export default EditEventPreview;