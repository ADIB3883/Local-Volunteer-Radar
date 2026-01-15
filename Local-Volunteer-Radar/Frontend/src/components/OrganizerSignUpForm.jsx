import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import organizationIcon from '../assets/icons/organizer-icon.png';
import mailIcon from '../assets/icons/mail-icon.png';
import passwordIcon from '../assets/icons/password-icon.png';
import phoneIcon from '../assets/icons/phone-icon.png';
import addressIcon from '../assets/icons/address-icon.png';
import descriptionIcon from '../assets/icons/description-icon.png';
import showPasswordIcon from '../assets/icons/show-password.png';
import hidePasswordIcon from '../assets/icons/hide-password.png';

const OrganizerSignUpForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        organizationName: '',
        email: '',
        password: '',
        phoneNumber: '',
        organizationType: '',
        description: '',
        address: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Call backend API to create organizer account
            const response = await authAPI.signupOrganizer(formData);
            
            // Store user data and token in localStorage
            const userWithToken = {
                ...response.user,
                token: response.token
            };
            localStorage.setItem('loggedInUser', JSON.stringify(userWithToken));
            
            // Also maintain backward compatibility with old localStorage structure
            const existingOrganizers = JSON.parse(localStorage.getItem("allOrganizers")) || [];
            existingOrganizers.push(response.user);
            localStorage.setItem("allOrganizers", JSON.stringify(existingOrganizers));

            alert(response.message || 'Account created successfully!');
            console.log('Organizer Sign Up Data:', response.user);
            navigate('/organizer-dashboard');
        } catch (error) {
            alert(error.message || 'Failed to create account. Please try again.');
            console.error('Signup error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-5 mt-4">
            <div className="grid gap-2">
                <label htmlFor="organizationName" className="text-sm font-bold text-black">
                    Organization Name
                </label>
                <div className="relative">
                    <img
                        src={organizationIcon}
                        alt="Organization icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
                    />
                    <input
                        type="text"
                        id="organizationName"
                        value={formData.organizationName}
                        onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900"
                        required
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-bold text-black">
                    Email Address
                </label>
                <div className="relative">
                    <img
                        src={mailIcon}
                        alt="Email icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
                    />
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900"
                        required
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-bold text-black">
                    Password
                </label>
                <div className="relative">
                    <img
                        src={passwordIcon}
                        alt="Password icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
                    />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                    >
                        <img
                            src={showPassword ? hidePasswordIcon : showPasswordIcon}
                            alt={showPassword ? 'Hide password' : 'Show password'}
                            className="w-5 h-5"
                        />
                    </button>
                </div>
            </div>

            <div className="grid gap-2">
                <label htmlFor="phoneNumber" className="text-sm font-bold text-black">
                    Phone Number
                </label>
                <div className="relative">
                    <img
                        src={phoneIcon}
                        alt="Phone icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
                    />
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900"
                        required
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <label htmlFor="organizationType" className="text-sm font-bold text-black">
                    Organization Type
                </label>
                <select
                    id="organizationType"
                    value={formData.organizationType}
                    onChange={(e) => setFormData({...formData, organizationType: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900 bg-white"
                    required
                >
                    <option value="" disabled>Select organization type</option>
                    <option value="ngo">NGO</option>
                    <option value="community">Community Group</option>
                    <option value="school">School</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-bold text-black">
                    Description
                </label>
                <div className="relative">
                    <img
                        src={descriptionIcon}
                        alt="Description icon"
                        className="absolute left-4 top-4 w-5 h-5 z-10"
                    />
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900 min-h-[100px] resize-y"
                        required
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <label htmlFor="address" className="text-sm font-bold text-black">
                    Address
                </label>
                <div className="relative">
                    <img
                        src={addressIcon}
                        alt="Address icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
                    />
                    <input
                        type="text"
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900"
                        required
                    />
                </div>
            </div>

            <div className="grid mt-2">
                <button
                    type="submit"
                    className="w-full py-3.5 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold text-lg hover:opacity-90 transition-opacity"
                >
                    Create Account
                </button>
            </div>
        </form>
    );
};

export default OrganizerSignUpForm;