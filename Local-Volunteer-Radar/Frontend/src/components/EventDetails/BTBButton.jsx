import BackButton from "../../assets/icons/Back.png";

const BTBButton = ({ text }) => {
    return (
        <button className="
          box-border
          relative
          left-15
          w-[180px] h-[36px]
          bg-white
          rounded-[10px]
          flex items-center justify-center gap-2
          text-[#000000]

        ">
            <img src={BackButton} alt="Delete icon" className={"w-[22px] h-[22px] "}/>



            <span className="font-normal">{text}</span>
        </button>
    )
}

export default BTBButton