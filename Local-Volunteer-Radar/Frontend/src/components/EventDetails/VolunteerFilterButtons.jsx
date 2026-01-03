import { useState } from "react";

export default function FilterButtons() {
    const [active, setActive] = useState("All");

    const base =
        "h-[30px] bg-transparent rounded-[10px] transition";

    const activeStyle =
        "bg-[#F9FCFF] shadow-[0px_1px_5px_rgba(0,0,0,0.25)]";

    return (
        <div className="flex flex-row rounded-[15px] bg-[#F3F7F9] items-center justify-evenly w-[227px] h-[42px] absolute top-[15%] left-[1.3%]">

            <button
                onClick={() => setActive("All")}
                className={`${base} w-[36px] ${active === "All" && activeStyle}`}
            >
                All
            </button>

            <button
                onClick={() => setActive("Pending")}
                className={`${base} w-[74px] ${active === "Pending" && activeStyle}`}
            >
                Pending
            </button>

            <button
                onClick={() => setActive("Approved")}
                className={`${base} w-[79px] ${active === "Approved" && activeStyle}`}
            >
                Approved
            </button>

        </div>
    );
}
