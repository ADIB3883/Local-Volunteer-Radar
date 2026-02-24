import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../api/authApi';
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Call backend API to create user in database
            const response = await signupUser({
                name: formData.organizationName,
                email: formData.email,
                password: formData.password,
                userType: 'organizer',
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                organizationType: formData.organizationType,
                description: formData.description
            });

            if (response.success) {
                // Store in localStorage for backward compatibility
                const existingOrganizers = JSON.parse(localStorage.getItem("allOrganizers")) || [];
                const newOrganizer = {
                    id: response.user.id,
                    role: "organizer",
                    organizationName: formData.organizationName,
                    ...formData,
                };

                localStorage.setItem(
                    "allOrganizers",
                    JSON.stringify([...existingOrganizers, newOrganizer])
                );

                // Navigate to login with pending state
                navigate('/login', {
                    state: {
                        pendingApproval: true,
                        email: formData.email,
                        userType: 'organizer'
                    }
                });
            }

        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'An error occurred during signup. Please try again.';

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = 'Cannot connect to server. Make sure backend is running on https://local-volunteer-radar.onrender.com';
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
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
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10 pointer-events-none">
                        <img
                            src={phoneIcon}
                            alt="Phone icon"
                            className="w-5 h-5"
                        />
                        <span className="text-gray-400 text-sm">+88</span>
                        <span className="text-gray-300">|</span>
                    </div>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^\d+$/.test(value)) {
                                setFormData({...formData, phoneNumber: value});
                            }
                        }}
                        className="w-full pl-32 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900"
                        placeholder="1XXXXXXXXX"
                        maxLength="11"
                        required
                    />

                    {formData.phoneNumber && formData.phoneNumber.length !== 11 && (
                        <div className="absolute left-0 -bottom-8 bg-red-500 text-white text-xs px-3 py-1.5 rounded shadow-lg whitespace-nowrap z-20">
                            {/^\d+$/.test(formData.phoneNumber)
                                ? `Please enter exactly 11 digits (${formData.phoneNumber.length}/11)`
                                : 'Only numeric characters allowed'
                            }
                            <div className="absolute left-4 -top-1 w-2 h-2 bg-red-500 transform rotate-45"></div>
                        </div>
                    )}
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
                    disabled={isSubmitting || formData.phoneNumber.length !== 11}
                    className="w-full cursor-pointer py-3.5 rounded-lg bg-gradient-to-r from-blue-500 to-teal-600 text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
            </div>
        </form>
    );
};

export default OrganizerSignUpForm;