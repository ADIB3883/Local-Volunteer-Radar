import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import userIcon from '../assets/icons/user-icon.png';
import mailIcon from '../assets/icons/mail-icon.png';
import passwordIcon from '../assets/icons/password-icon.png';
import phoneIcon from '../assets/icons/phone-icon.png';
import addressIcon from '../assets/icons/address-icon.png';
import showPasswordIcon from '../assets/icons/show-password.png';
import hidePasswordIcon from '../assets/icons/hide-password.png';

const VolunteerSignUpForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        skills: {
            teaching: false,
            firstAid: false,
            mediaPhotography: false,
            technicalSupport: false,
            animalRescue: false,
            distribution: false,
            eventLogistics: false,
            other: false
        }
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSkillChange = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [skill]: !prev.skills[skill]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Call backend API to create volunteer account
            const response = await authAPI.signupVolunteer(formData);
            
            // Store user data and token in localStorage
            const userWithToken = {
                ...response.user,
                token: response.token
            };
            localStorage.setItem('loggedInUser', JSON.stringify(userWithToken));
            
            // Also maintain backward compatibility with old localStorage structure
            const existingVolunteers = JSON.parse(localStorage.getItem("allVolunteers")) || [];
            existingVolunteers.push(response.user);
            localStorage.setItem("allVolunteers", JSON.stringify(existingVolunteers));

            alert(response.message || 'Account created successfully!');
            console.log('Volunteer Sign Up Data:', response.user);
            navigate('/volunteer-dashboard');
        } catch (error) {
            alert(error.message || 'Failed to create account. Please try again.');
            console.error('Signup error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-5 mt-4">
            <div className="grid gap-2">
                <label htmlFor="fullName" className="text-sm font-bold text-black">
                    Full Name
                </label>
                <div className="relative">
                    <img
                        src={userIcon}
                        alt="User icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
                    />
                    <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
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

            <div className="grid gap-3">
                <label className="text-sm font-bold text-black">
                    Your Skills
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.skills.teaching}
                            onChange={() => handleSkillChange('teaching')}
                            className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Teaching</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.skills.animalRescue}
                            onChange={() => handleSkillChange('animalRescue')}
                            className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Animal Rescue/Care</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.skills.firstAid}
                            onChange={() => handleSkillChange('firstAid')}
                            className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">First Aid/Medical</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.skills.distribution}
                            onChange={() => handleSkillChange('distribution')}
                            className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Distribution</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.skills.mediaPhotography}
                            onChange={() => handleSkillChange('mediaPhotography')}
                            className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Media/Photography</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.skills.eventLogistics}
                            onChange={() => handleSkillChange('eventLogistics')}
                            className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Event Logistics</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.skills.technicalSupport}
                            onChange={() => handleSkillChange('technicalSupport')}
                            className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Technical Support</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.skills.other}
                            onChange={() => handleSkillChange('other')}
                            className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Other</span>
                    </label>
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
                    className="w-full py-3.5 rounded-lg bg-gradient-to-r from-blue-500 to-teal-600 text-white font-bold text-lg hover:opacity-90 transition-opacity"
                >
                    Create Account
                </button>
            </div>
        </form>
    );
};

export default VolunteerSignUpForm;