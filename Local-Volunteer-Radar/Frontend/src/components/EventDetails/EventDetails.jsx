import React from "react";
import EditButton from "./EditButton.jsx";
import DeleteButton from "./DeleteButton.jsx";
import AnnouncementButton from "./AnnouncementButton.jsx";
import LogoutButton from "./LogoutButton.jsx";
import MainNav from "./MainNav.jsx";
import EventInfo from "./EventInfo.jsx";
import EventVolunteerInfo from "./EventVolunteerInfo.jsx";
import QuickAction from "./QuickAction.jsx";
function EventDetails() {
    return (
        <section className="
        min-h-screen
        bg-[linear-gradient(113.19deg,#FFFFFF_0%,#EEF5FE_76.1%)]
        flex flex-col

        ">
            <MainNav> </MainNav>
            <EventInfo EventName="Relief Distribution"/>
            <EventVolunteerInfo/>
            <QuickAction></QuickAction>
            <div className="h-[200px]"></div>


        </section>
    );
}

export default EventDetails;
