import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveringClose, setHoveringClose] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [toggleAuth, setToggleAuth] = useState(false);
  const [authAction, setAuthAction] = useState("");

  const handleClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/game");
    }, 600);
  };

  return (
    <div
      className={`w-[100%] h-[100%] flex justify-center items-center ${
        isTransitioning ? "transitionToGame" : ""
      } ease-in-out chosenFont`}
    >
      <div className="flex flex-col justify-center items-center gap-6">
        <h1 className="text-[5rem]">Ordle</h1>
        <span
          className={`${toggleAuth ? "hidden" : "flex"} flex flex-col gap-6`}
        >
          <span onClick={handleClick} className="cursor-pointer">
            <svg
              className={`w-[148px] h-[148px] ${
                isTransitioning ? "rolling" : ""
              }`}
              viewBox="0 0 148 148"
              fill="none"
            >
              <path
                d="M100 73.5L61.75 98.1817L61.75 48.8183L100 73.5Z"
                fill="#62B462"
              />
              <path
                d="M74 135.667C108.058 135.667 135.667 108.058 135.667 74C135.667 39.9424 108.058 12.3333 74 12.3333C39.9425 12.3333 12.3334 39.9424 12.3334 74C12.3334 108.058 39.9425 135.667 74 135.667Z"
                stroke="#1E1E1E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M61.6667 49.3333L98.6667 74L61.6667 98.6667V49.3333Z"
                stroke="#1E1E1E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="flex flex-col items-center gap-2">
            <p
              className="hover:text-[#62B462] hover:underline font-bold cursor-pointer"
              onClick={() => {
                setToggleAuth(true);
                setAuthAction("LOGIN");
              }}
            >
              LOGIN
            </p>
            <p
              className="hover:text-[#62B462] hover:underline font-semibold cursor-pointer"
              onClick={() => {
                setToggleAuth(true);
                setAuthAction("REGISTER");
              }}
            >
              REGISTER
            </p>
          </span>
        </span>
        <span
          className={`${
            toggleAuth ? "flex" : "hidden"
          } w-[259px] h-[228px] flex-col gap-1 bg-[#62b46244] text-[1.6rem]`}
        >
          <span
            className="absolute p-1 cursor-pointer"
            onClick={() => {
              setToggleAuth(false);
              setUsername("");
              setPassword("");
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              onMouseEnter={() => setHoveringClose(true)}
              onMouseLeave={() => setHoveringClose(false)}
            >
              <path
                d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                fill={hoveringClose ? "#62B462" : "#000000"}
              />
            </svg>
          </span>
          <input
            className="p-4 bg-transparent text-center"
            type="string"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="p-4 bg-transparent text-center"
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-[8px] p-4 bg-transparent hover:text-[#62B462] text-center cursor-pointer">
            {authAction}
          </p>
        </span>
      </div>
    </div>
  );
};

export default Auth;
