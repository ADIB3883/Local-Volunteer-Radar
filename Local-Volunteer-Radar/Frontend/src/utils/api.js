const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return loggedInUser?.token || null;
};

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

// Auth API
export const authAPI = {
    signupVolunteer: (userData) => 
        apiRequest('/auth/signup/volunteer', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),

    signupOrganizer: (userData) => 
        apiRequest('/auth/signup/organizer', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),

    login: (credentials) => 
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
};

// Events API
export const eventsAPI = {
    getAll: () => apiRequest('/events'),
    
    create: (eventData) => 
        apiRequest('/events', {
            method: 'POST',
            body: JSON.stringify(eventData),
        }),

    update: (id, eventData) => 
        apiRequest(`/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(eventData),
        }),
};

// Registrations API
export const registrationsAPI = {
    getAll: () => apiRequest('/registrations'),
    
    create: (registrationData) => 
        apiRequest('/registrations', {
            method: 'POST',
            body: JSON.stringify(registrationData),
        }),
};

// Notifications API
export const notificationsAPI = {
    getAll: () => apiRequest('/notifications'),
    
    create: (notificationData) => 
        apiRequest('/notifications', {
            method: 'POST',
            body: JSON.stringify(notificationData),
        }),

    update: (id, notificationData) => 
        apiRequest(`/notifications/${id}`, {
            method: 'PUT',
            body: JSON.stringify(notificationData),
        }),
};

// Announcements API
export const announcementsAPI = {
    getAll: () => apiRequest('/announcements'),
    
    create: (announcementData) => 
        apiRequest('/announcements', {
            method: 'POST',
            body: JSON.stringify(announcementData),
        }),
};

// Health check
export const healthCheck = () => apiRequest('/health');
