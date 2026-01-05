import { useState } from "react";

function FilterButtons({ activeFilter, setActiveFilter }) {

    const base =
        "h-[30px] bg-transparent rounded-[10px] transition";

    const activeStyle =
        "bg-[#F9FCFF] shadow-[0px_1px_5px_rgba(0,0,0,0.25)]";

    return (
        <div className="flex flex-row rounded-[15px] bg-[#F3F7F9] items-center justify-evenly w-[227px] h-[42px] absolute top-[15%] left-[1.3%]">

            <button

                onClick={() => setActiveFilter("All")}
                className={`${base} w-[36px] ${activeFilter === "All" && activeStyle}`}
            >
                All
            </button>

            <button

                onClick={() => setActiveFilter("Pending")}
                className={`${base} w-[74px] ${activeFilter === "Pending" && activeStyle}`}
            >
                Pending
            </button>

            <button

                onClick={() => setActiveFilter("Approved")}
                className={`${base} w-[79px] ${activeFilter === "Approved" && activeStyle}`}
            >
                Approved
            </button>

        </div>
    );
}
export default FilterButtons;