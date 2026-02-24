const LogoutPopup = ({
                         showLogout,
                         borderColor = 'border-green-500',
                         bgColor = 'bg-green-500',
                         message = 'Successfully logged out'
                     }) => {
    return (
        <div
            className={`fixed top-6 right-6 bg-white rounded-lg shadow-2xl p-4 flex items-center gap-3 border-l-4 ${borderColor} transform transition-all duration-500 ${
                showLogout ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
            style={{ zIndex: 9999 }}
        >
            <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-3xl font-bold leading-none">✓</span>
            </div>
            <div>
                <p className="font-bold text-gray-900">{message}</p>
            </div>
        </div>
    );
};

export default LogoutPopup;
