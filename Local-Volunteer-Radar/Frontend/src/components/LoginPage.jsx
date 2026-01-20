import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeButton from './HomeButton';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import LoginSuccessPopUp from "./LoginSuccessPopUp.jsx";


const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState('login');

    //for POPUP
    const [showNotification, setShowNotification] = useState(false);
    const [notificationConfig, setNotificationConfig] = useState({
        borderColor: 'border-green-500',
        bgColor: 'bg-green-500',
        message: 'Login Successful!'
    });

    // Check if navigation state specifies signup view
    useEffect(() => {
        if (location.state?.view === 'signup') {
            setSelected('signup');
        }
    }, [location.state]);

    return (
        <div className="min-h-screen grid place-items-center bg-gradient-to-br from-blue-200 to-teal-200 p-4">
            <LoginSuccessPopUp
                showSuccess={showNotification}
                borderColor={notificationConfig.borderColor}
                bgColor={notificationConfig.bgColor}
                message={notificationConfig.message}
            />
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl grid grid-rows-[auto_auto_1fr] gap-6 p-12">
                {/* Home Button Row */}
                <div className="grid place-items-center">
                    <HomeButton/>
                </div>

                {/* Login/Sign Up Toggle Row */}
                <div className="grid grid-cols-2 gap-0">
                    <button
                        onClick={() => setSelected('login')}
                        className={`text-lg font-medium py-3 px-6 rounded-l-lg border-2 border-gray-300 transition-colors ${
                            selected === 'login' ? 'bg-white text-black' : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setSelected('signup')}
                        className={`text-lg font-medium py-3 px-6 rounded-r-lg border-2 border-gray-300 transition-colors ${
                            selected === 'signup' ? 'bg-white text-black' : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form Row */}
                <div className="grid">
                    {selected === 'login' && (
                        <LoginForm
                            setShowNotification={setShowNotification}
                            setNotificationConfig={setNotificationConfig}
                        />
                    )}
                    {selected === 'signup' && <SignUpForm initialUserType={location.state?.userType} />}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;