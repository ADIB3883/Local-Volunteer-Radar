import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const HomeButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
            <img
                src={logo}
                alt="Local Volunteer Radar Logo"
                className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-700 bg-clip-text text-transparent">
                Local Volunteer Radar
            </span>
        </button>
    );
};

export default HomeButton;

