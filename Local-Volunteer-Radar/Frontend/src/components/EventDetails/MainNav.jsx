import React from "react";
import LogoIcon from "../../assets/icons/logo.png"
import BTBButton from "./BTBButton.jsx";
import LogoutButton from "./LogoutButton.jsx";

function MainNav(){

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
                <BTBButton text="Back to Dashboard"></BTBButton>
                <LogoutButton text="Logout"></LogoutButton>
            </div>

        </div>
    );



}

export default MainNav;