import LogoutIcon from "../../assets/icons/logout.png";
import {useNavigate} from "react-router-dom";


const LogoutButton = ({ text }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate(`/login`);
    };
    return (
        <button onClick={handleLogout} className="
          cursor-pointer
          absolute
          w-[115px] h-[36px]
          right-[5%]
          bg-white
          rounded-[10px]
          flex items-center justify-center gap-4
          text-[#000000]

        ">
            <img src={LogoutIcon} alt="Delete icon" className={"w-[22px] h-[22px]"}/>



            <span className="font-medium">{text}</span>
        </button>
    )
}

export default LogoutButton
