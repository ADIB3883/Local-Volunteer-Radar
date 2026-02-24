import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import passwordIcon from '../assets/icons/password-icon.png';
import showPasswordIcon from '../assets/icons/show-password.png';
import hidePasswordIcon from '../assets/icons/hide-password.png';
import HomeButton from "./HomeButton.jsx";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const otp = location.state?.otp || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Redirect if email or OTP is missing
    if (!email || !otp) {
        navigate('/forgot-password');
        return null;
    }

    // Password strength checker
    const checkPasswordStrength = (password) => {
        if (password.length === 0) {
            setPasswordStrength('');
            return;
        }

        if (password.length < 6) {
            setPasswordStrength('weak');
        } else if (password.length < 10) {
            setPasswordStrength('medium');
        } else {
            setPasswordStrength('strong');
        }
    };

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        checkPasswordStrength(value);setError('');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!newPassword) {
            setError('Please enter a password');
            return;
        }


        setLoading(true);

        try {
            const response = await fetch('https://local-volunteer-radar.onrender.com/api/forgot-password/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Reset password error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 'weak':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'strong':
                return 'bg-green-500';
            default:
                return 'bg-gray-200';
        }
    };

    const getStrengthWidth = () => {
        switch (passwordStrength) {
            case 'weak':
                return 'w-1/3';
            case 'medium':
                return 'w-2/3';
            case 'strong':
                return 'w-full';
            default:
                return 'w-0';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 flex items-center justify-center p-4">
            <div
                className={`fixed top-6 left-6 bg-white rounded-lg shadow-2xl p-4 flex items-center gap-3 border-l-4 border-green-500 transform transition-all duration-500 z-50 ${
                    showSuccess ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                }`}
            >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <div>
                    <p className="font-bold text-gray-900">Password Reset Successful!</p>
                    <p className="text-sm text-gray-600">Redirecting to login...</p>
                </div>
            </div>

            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
                <div className="text-left space-y-6 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Create New Password
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Your new password must be different from your previous password.
                        We recommend following these security tips for a stronger password.
                    </p><ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">
                                Consider using at least 8-10 characters for better security
                            </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">
                                Mix letters, numbers, and symbols for stronger protection
                            </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">
                                Avoid using common words or easily guessable information
                            </span>
                    </li><li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                                Make sure both passwords match before submitting
                            </span>
                </li>
                </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
                    <div className="grid place-items-center">
                        <HomeButton/>
                    </div>
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Reset Password
                            </h2>
                            <p className="text-gray-600">
                                Enter your new password below
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {email && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="text-sm font-bold text-gray-900">
                                New Password
                            </label>
                            <div className="relative">
                                <img
                                    src={passwordIcon}
                                    alt="Password icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
                                />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900"
                                    placeholder="Enter new password"
                                    requireddisabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                                    disabled={loading}
                                >
                                    <img
                                        src={showNewPassword ? hidePasswordIcon : showPasswordIcon}
                                        alt={showNewPassword ? 'Hide password' : 'Show password'}
                                        className="w-5 h-5"
                                    />
                                </button>
                            </div>

                            {newPassword && (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Password strength:</span>
                                        <span className={`text-xs font-semibold ${
                                            passwordStrength === 'weak' ? 'text-red-500' :
                                                passwordStrength === 'medium' ? 'text-yellow-600' :
                                                    passwordStrength === 'strong' ? 'text-green-600' : ''
                                        }`}>
                                            {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-bold text-gray-900">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <img
                                    src={passwordIcon}
                                    alt="Password icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
                                />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError('');
                                    }}
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900"
                                    placeholder="Confirm new password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                                    disabled={loading}
                                >
                                    <img
                                        src={showConfirmPassword ? hidePasswordIcon : showPasswordIcon}
                                        alt={showConfirmPassword ? 'Hide password' : 'Show password'}
                                        className="w-5 h-5"
                                    />
                                </button>
                            </div>
                            {confirmPassword && newPassword && confirmPassword !== newPassword && (
                                <p className="text-xs text-red-500">Passwords do not match</p>
                            )}
                            {confirmPassword && newPassword && confirmPassword === newPassword && (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Passwords match
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || newPassword !== confirmPassword || !newPassword}
                            className="w-full py-3.5 rounded-lg bg-gradient-to-r from-blue-500 to-teal-600 text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Back to Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
