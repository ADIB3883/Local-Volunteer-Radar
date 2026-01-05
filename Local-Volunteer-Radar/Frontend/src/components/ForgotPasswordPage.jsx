import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mailIcon from '../assets/icons/mail-icon.png';
import HomeButton from "./HomeButton.jsx";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('email'); // 'email' or 'otp'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSendOTP = (e) => {
        e.preventDefault();
        setError('');

        // Simulate OTP sending (replace with actual API call)
        if (email) {
            setSuccessMessage('OTP sent to your email. Please check your inbox.');
            setStep('otp');
        }
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        setError('');

        // Simulate OTP verification (replace with actual API call)
        if (otp.length === 6) {
            // If OTP is valid, navigate to reset password page
            navigate('/reset-password', { state: { email } });
        } else {
            setError('Invalid or expired OTP');
        }
    };

    const handleUseDifferentEmail = () => {
        setStep('email');
        setEmail('');
        setOtp('');
        setError('');
        setSuccessMessage('');
    };

    const handleBackToSignIn = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side - Information */}
                <div className="text-left space-y-6 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Reset Your Password
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Enter your email address and we'll send you a 6-digit OTP code
                        to verify your identity and reset your password.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">
                                We'll send a verification code to your email
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">
                                Enter the 6-digit OTP code to verify your identity
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">
                                Create a new password and regain access to your account
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Right Side - Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
                    <div className="space-y-6">
                        <div className="grid place-items-center">
                            <HomeButton/>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Forgot Password
                            </h2>
                            <p className="text-gray-600">
                                {step === 'email'
                                    ? 'Enter your email address to receive an OTP'
                                    : 'Enter the 6-digit OTP sent to your email'}
                            </p>
                        </div>

                        {/* Success Message */}
                        {successMessage && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                                <svg
                                    className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                <p className="text-sm text-blue-700">{successMessage}</p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Email Step */}
                        {step === 'email' && (
                            <form onSubmit={handleSendOTP} className="space-y-6">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-bold text-gray-900"
                                    >
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 rounded-lg bg-gradient-to-r from-blue-500 to-teal-600 text-white font-bold text-lg hover:opacity-90 transition-opacity"
                                >
                                    Send OTP
                                </button>

                                <button
                                    type="button"
                                    onClick={handleBackToSignIn}
                                    className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
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
                        )}

                        {/* OTP Step */}
                        {step === 'otp' && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="email-display"
                                        className="text-sm font-bold text-gray-900"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email-display"
                                        value={email}
                                        disabled
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="otp"
                                        className="text-sm font-bold text-gray-900"
                                    >
                                        Enter OTP
                                    </label>
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-900 text-center text-2xl tracking-widest font-semibold"
                                        placeholder="123456"
                                        maxLength="6"
                                        required
                                    />
                                    <p className="text-xs text-gray-500">
                                        OTP is valid for 10 minutes. Check console for demo OTP.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 rounded-lg bg-gradient-to-r from-blue-500 to-teal-600 text-white font-bold text-lg hover:opacity-90 transition-opacity"
                                >
                                    Verify OTP
                                </button>

                                <button
                                    type="button"
                                    onClick={handleUseDifferentEmail}
                                    className="w-full py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Use Different Email
                                </button>

                                <button
                                    type="button"
                                    onClick={handleBackToSignIn}
                                    className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;