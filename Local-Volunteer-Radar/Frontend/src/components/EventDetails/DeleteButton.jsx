import deleteIcon from "../../assets/icons/delete.png";

const DeleteButton = ({ text }) => {
    return (/* Edit Button */
        <button
            className="
            box-border

            w-[106px] h-[36px]

            bg-[#EEEEEE]

            shadow-[0px_1px_4px_rgba(0,0,0,0.25)]
            rounded-[10px]
            flex items-center justify-center gap-2
            text-[#DB004B]
          "
        >
            <img src={deleteIcon} alt="Delete icon" className={"w-[25px] h-[25px]"}/>

            <span className="font-medium">{text}</span>
        </button>
    )
}

export default DeleteButton