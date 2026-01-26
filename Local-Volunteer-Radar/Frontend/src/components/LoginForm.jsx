import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import UserTypeButton from './UserTypeButton';
import mailIcon from '../assets/icons/mail-icon.png';
import passwordIcon from '../assets/icons/password-icon.png';
import showPasswordIcon from '../assets/icons/show-password.png';
import hidePasswordIcon from '../assets/icons/hide-password.png';

const LoginForm = ({ setShowNotification, setNotificationConfig }) => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('volunteer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser(email, password, userType);

            if (response.success) {
                localStorage.setItem('loggedInUser', JSON.stringify(response.user));

                // alert('Login successful!');
                // ✅ Show success notification
                setNotificationConfig({
                    borderColor: 'border-green-500',
                    bgColor: 'bg-green-500',
                    message: 'Login Successful!'
                });
                setShowNotification(true);

                // Hide popup and navigate after 2 seconds
                setTimeout(() => {
                    setShowNotification(false);

                    const dashboardRoutes = {
                        volunteer: '/volunteer-dashboard',
                        organizer: '/organizer-dashboard',
                        admin: '/admin-dashboard'
                    };

                    navigate(dashboardRoutes[userType]);
                }, 2000);
            }
        } catch (error) {
            // ❌ Show error notification with backend message
            let errorMessage = 'Login Failed!';

            if (error.response && error.response.data && error.response.data.message) {
                // Use the backend error message
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = 'Cannot connect to server';
            } else {
                errorMessage = 'An error occurred. Please try again.';
            }

            setNotificationConfig({
                borderColor: 'border-red-300',
                bgColor: 'bg-red-400',
                message: errorMessage  // ← Backend message like "Invalid email or password"
            });
            setShowNotification(true);

            // Hide error notification after 3 seconds
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);

            console.error('Login error:', error);
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    return (
        <form
            onSubmit={handleSignIn}
            className="grid gap-6 max-w-3xl mx-auto w-full px-8"
        >
            <div className="grid gap-2 text-center">
                <h2 className="text-3xl font-bold text-black">
                    Welcome back!
                </h2>
                <p className="text-gray-600 text-base">
                    Sign in to continue your journey
                </p>
            </div>

            <div className="grid gap-3">
                <label className="text-sm font-bold text-black">
                    I am a...
                </label>
                <div className="grid grid-cols-3 gap-4">
                    <UserTypeButton
                        type="volunteer"
                        title="Volunteer"
                        isSelected={userType === 'volunteer'}
                        onClick={() => setUserType('volunteer')}
                    />
                    <UserTypeButton
                        type="organizer"
                        title="Organizer"
                        isSelected={userType === 'organizer'}
                        onClick={() => setUserType('organizer')}
                    />
                    <UserTypeButton
                        type="admin"
                        title="Admin"
                        isSelected={userType === 'admin'}
                        onClick={() => setUserType('admin')}
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-bold text-black">
                    Email Address
                </label>
                <div className="grid">
                    <div className="relative">
                        <img
                            src={mailIcon}
                            alt="Email icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
                        />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900"
                            placeholder=""
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-bold text-black">
                    Password
                </label>
                <div className="grid gap-2">
                    <div className="relative">
                        <img
                            src={passwordIcon}
                            alt="Password icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
                        />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900"
                            placeholder=""
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
                    <div className="grid justify-end">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-blue-500 hover:text-teal-600 cursor-pointer text-sm font-medium"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid mt-2">
                <button
                    type="submit"
                    className="w-full cursor-pointer py-3.5 rounded-lg bg-gradient-to-r from-blue-500 to-teal-600 text-white font-bold text-lg hover:opacity-90 transition-opacity"
                >
                    Sign In
                </button>
            </div>
        </form>
    );
};

export default LoginForm;