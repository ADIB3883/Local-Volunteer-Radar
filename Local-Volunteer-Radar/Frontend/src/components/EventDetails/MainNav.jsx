import React from "react";
import LogoIcon from "../../assets/icons/logo.png"
import BTBButton from "./BTBButton.jsx";
import LogoutButton from "./LogoutButton.jsx";
import { useNavigate } from 'react-router-dom';

function MainNav(){
    const navigate = useNavigate();

    // View Details Navigate
    const handleBacktoDashboard = () => {
        navigate(`/organizer-dashboard`);
    };


    return (
        <div className="
        flex
        bg-white
        shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
        w-screen h-1/10 fixed top-0 left-0 z-10
        ">
            {/*header-container*/}
            <div className="
                w-screen
                py-0 px-2
                flex
                items-center
                justify-between
            ">
                <div onClick={handleBacktoDashboard}>
                    <BTBButton
                        text="Back to Dashboard"></BTBButton>
                </div>


                <LogoutButton text="Logout"></LogoutButton>

            </div>

        </div>
    );



}

export default MainNav;