const EditButton = ({text}) => {
    return (
        <button className="
          box-border

          w-[94px] h-[36px]

          bg-[#E4EDF0]

          shadow-[0px_1px_4px_rgba(0,0,0,0.25)]
          rounded-[10px]
          flex items-center justify-center gap-4
          text-[#000000]
          transition
        ">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10 1.99609H3C2.46957 1.99609 1.96086 2.20681 1.58579 2.58188C1.21071 2.95695 1 3.46566 1 3.99609V17.9961C1 18.5265 1.21071 19.0352 1.58579 19.4103C1.96086 19.7854 2.46957 19.9961 3 19.9961H17C17.5304 19.9961 18.0391 19.7854 18.4142 19.4103C18.7893 19.0352 19 18.5265 19 17.9961V10.9961"
                    stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path
                    d="M16.3751 1.62132C16.7729 1.2235 17.3125 1 17.8751 1C18.4377 1 18.9773 1.2235 19.3751 1.62132C19.7729 2.01914 19.9964 2.55871 19.9964 3.12132C19.9964 3.68393 19.7729 4.2235 19.3751 4.62132L10.3621 13.6353C10.1246 13.8726 9.8313 14.0462 9.50909 14.1403L6.63609 14.9803C6.55005 15.0054 6.45883 15.0069 6.372 14.9847C6.28517 14.9624 6.20592 14.9173 6.14254 14.8539C6.07916 14.7905 6.03398 14.7112 6.01174 14.6244C5.98949 14.5376 5.991 14.4464 6.01609 14.3603L6.85609 11.4873C6.95062 11.1654 7.12463 10.8724 7.36209 10.6353L16.3751 1.62132Z"
                    stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <span className="font-medium">{text}</span>
        </button>
    )
}

export default EditButton