import volunteerIcon from '../assets/icons/volunteer-icon.png';
import organizerIcon from '../assets/icons/organizer-icon.png';
import adminIcon from '../assets/icons/admin-icon.png';

const UserTypeButton = ({ type, title, isSelected, onClick }) => {
    const iconMap = {
        volunteer: volunteerIcon,
        organizer: organizerIcon,
        admin: adminIcon,
    };

    const colorMap = {
        volunteer: {
            bg: 'bg-green-100',
            border: 'border-green-500',
            text: 'text-green-700',
        },
        organizer: {
            bg: 'bg-blue-100',
            border: 'border-blue-500',
            text: 'text-blue-700',
        },
        admin: {
            bg: 'bg-red-100',
            border: 'border-red-500',
            text: 'text-red-700',
        },
    };

    const colors = colorMap[type] || colorMap.volunteer;
    const icon = iconMap[type] || volunteerIcon;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                flex flex-col items-center justify-center
                px-5 py-4 rounded-xl border-2 transition-all
                min-w-[110px]
                ${isSelected
                ? `${colors.bg} ${colors.border} ${colors.text} font-semibold`
                : 'bg-white border-gray-300 text-black'
            }
                hover:opacity-80
            `}
        >
            <img
                src={icon}
                alt={`${title} icon`}
                className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-semibold">{title}</span>
        </button>
    );
};

export default UserTypeButton;