import { useState, useContext } from "react";
import { Context } from "./Game";

const Buttons = () => {
  const { setShowStatistics, setShowHelp, setShowAccount } =
    useContext(Context);

  const [hoveringStatistics, setHoveringStatistics] = useState(false);
  const [hoveringUser, setHoveringUser] = useState(false);
  const [hoveringHelp, setHoveringHelp] = useState(false);

  return (
    <div className="flex flex-row items-center gap-4">
      <svg
        onMouseEnter={() => setHoveringHelp(true)}
        onMouseLeave={() => setHoveringHelp(false)}
        className="w-6 h-6 cursor-pointer"
        viewBox="0 0 24 24"
        fill="none"
        onClick={() => setShowHelp(true)}
      >
        <path
          d="M9 9.00001C9.00011 8.45004 9.15139 7.91068 9.43732 7.44088C9.72325 6.97108 10.1328 6.58891 10.6213 6.33616C11.1097 6.08341 11.6583 5.96979 12.2069 6.00773C12.7556 6.04566 13.2833 6.23369 13.7323 6.55126C14.1813 6.86883 14.5344 7.30372 14.7529 7.8084C14.9715 8.31308 15.0471 8.86813 14.9715 9.41288C14.8959 9.95763 14.6721 10.4711 14.3244 10.8972C13.9767 11.3234 13.5185 11.6457 13 11.829C12.7074 11.9325 12.4541 12.1241 12.275 12.3775C12.0959 12.6309 11.9998 12.9337 12 13.244V14.5"
          stroke={hoveringHelp ? "#62B462" : "#000000"}
          // stroke-width="1.5"
          // stroke-linecap="round"
          // stroke-linejoin="round"
        />
        <path
          d="M12 18V18.5001"
          stroke={hoveringHelp ? "#62B462" : "#000000"}
          // stroke-width="1.5"
          // stroke-linecap="round"
          // stroke-linejoin="round"
        />
        <path
          d="M12 23.25C18.2132 23.25 23.25 18.2132 23.25 12C23.25 5.7868 18.2132 0.75 12 0.75C5.7868 0.75 0.75 5.7868 0.75 12C0.75 18.2132 5.7868 23.25 12 23.25Z"
          stroke={hoveringHelp ? "#62B462" : "#000000"}
          // stroke-width="1.5"
          // stroke-miterlimit="10"
        />
      </svg>
      <svg
        onMouseEnter={() => setHoveringUser(true)}
        onMouseLeave={() => setHoveringUser(false)}
        className="w-[26px] h-[26px] cursor-pointer"
        viewBox="0 0 24 24"
        fill="none"
        onClick={() => setShowAccount(true)}
      >
        <path
          // fill-rule="evenodd"
          // clip-rule="evenodd"
          d="M8.25 9C8.25 6.92893 9.92893 5.25 12 5.25C14.0711 5.25 15.75 6.92893 15.75 9C15.75 11.0711 14.0711 12.75 12 12.75C9.92893 12.75 8.25 11.0711 8.25 9ZM12 6.75C10.7574 6.75 9.75 7.75736 9.75 9C9.75 10.2426 10.7574 11.25 12 11.25C13.2426 11.25 14.25 10.2426 14.25 9C14.25 7.75736 13.2426 6.75 12 6.75Z"
          fill={hoveringUser ? "#62B462" : "#000000"}
        />
        <path
          // fill-rule="evenodd"
          // clip-rule="evenodd"
          d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 14.5456 3.77827 16.851 5.4421 18.5235C5.6225 17.5504 5.97694 16.6329 6.68837 15.8951C7.75252 14.7915 9.45416 14.25 12 14.25C14.5457 14.25 16.2474 14.7915 17.3115 15.8951C18.023 16.6329 18.3774 17.5505 18.5578 18.5236C20.2217 16.8511 21.25 14.5456 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM17.1937 19.6554C17.0918 18.4435 16.8286 17.5553 16.2318 16.9363C15.5823 16.2628 14.3789 15.75 12 15.75C9.62099 15.75 8.41761 16.2628 7.76815 16.9363C7.17127 17.5553 6.90811 18.4434 6.80622 19.6553C8.28684 20.6618 10.0747 21.25 12 21.25C13.9252 21.25 15.7131 20.6618 17.1937 19.6554Z"
          fill={hoveringUser ? "#62B462" : "#000000"}
        />
      </svg>
      <svg
        onMouseEnter={() => setHoveringStatistics(true)}
        onMouseLeave={() => setHoveringStatistics(false)}
        className="w-6 h-6 cursor-pointer"
        viewBox="0 0 24 24"
        d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
        fill={hoveringStatistics ? "#62B462" : "#000000"}
        onClick={() => setShowStatistics(true)}
      >
        <path d="M22,3H19V2a1,1,0,0,0-1-1H6A1,1,0,0,0,5,2V3H2A1,1,0,0,0,1,4V6a4.994,4.994,0,0,0,4.276,4.927A7.009,7.009,0,0,0,11,15.92V18H7a1,1,0,0,0-.949.684l-1,3A1,1,0,0,0,6,23H18a1,1,0,0,0,.948-1.316l-1-3A1,1,0,0,0,17,18H13V15.92a7.009,7.009,0,0,0,5.724-4.993A4.994,4.994,0,0,0,23,6V4A1,1,0,0,0,22,3ZM5,8.829A3.006,3.006,0,0,1,3,6V5H5ZM16.279,20l.333,1H7.387l.334-1ZM17,9A5,5,0,0,1,7,9V3H17Zm4-3a3.006,3.006,0,0,1-2,2.829V5h2ZM10.667,8.667,9,7.292,11,7l1-2,1,2,2,.292L13.333,8.667,13.854,11,12,9.667,10.146,11Z" />
      </svg>
    </div>
  );
};

export default Buttons;
