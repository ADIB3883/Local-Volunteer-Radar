import axios from 'axios';

const API_BASE_URL = 'https://local-volunteer-radar.onrender.com/api';

// Login function
export const loginUser = async (email, password, userType) => {
    const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
        userType
    });
    return response.data;
};

// Signup function
export const signupUser = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    return response.data;
};
