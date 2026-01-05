function NoVolunteerInfo({ text,path }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {path && <img src={path} alt="No volunteer" className="w-[52px] h-[52px] object-contain" />}
            <span className="text-[#404040] font-[15px]">{text}</span>
        </div>
    );
}

export default NoVolunteerInfo;
