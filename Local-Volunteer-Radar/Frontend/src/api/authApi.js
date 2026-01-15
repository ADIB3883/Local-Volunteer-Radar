import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Login function
export const loginUser = async (email, password, userType) => {
    const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
        userType
    });
    return response.data;
};