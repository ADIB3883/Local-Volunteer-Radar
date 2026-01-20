import {useState} from "react";


const LoginSuccessPopUp = ({ showSuccess }) => {

    return (

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
                <p className="font-bold text-gray-900">Login Successful!</p>
                {/*<p className="text-sm text-gray-600">Redirecting to login...</p>*/}
            </div>
        </div>



    );


}

export default LoginSuccessPopUp;