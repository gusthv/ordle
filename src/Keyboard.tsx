import { useState } from "react";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyFeedback: { [key: string]: string };
  isMobile: boolean;
}

const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  keyFeedback,
  isMobile,
}) => {
  const characterArray = ["QWERTYUIOPÅ", "ASDFGHJKLÖÄ", "1ZXCVBNM0"];

  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleKeyboardPress = (e: React.MouseEvent<HTMLButtonElement>) => {
    const char = e.currentTarget.textContent || "";
    setPressedKey(char);
    onKeyPress(char);

    setTimeout(() => {
      setPressedKey(null);
    }, 50);
  };

  return (
    <div className={`${!isMobile ? "w-[312px]" : "w-[85%]"} mt-6`}>
      {characterArray.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center items-center gap-1 text-[0.8rem]"
        >
          {row.split("").map((char, charIndex) => (
            <button
              key={charIndex}
              className={`${
                char === "0" || char === "1" ? "w-16 h-12" : "w-8 h-12"
              } flex flex-grow justify-center items-center mt-1 border-2 rounded-md font-bold ${
                pressedKey === char
                  ? "bg-gray-200 pulse"
                  : keyFeedback[char] === "green"
                  ? "bg-green-500 pulse"
                  : keyFeedback[char] === "yellow"
                  ? "bg-yellow-500 pulse"
                  : keyFeedback[char] === "grey"
                  ? "bg-gray-500"
                  : "hover:bg-gray-200"
              } ${char === "0" || char === "1" ? "text-[0.75rem]" : ""}`}
              onClick={handleKeyboardPress}
            >
              {char === "0" ? "ORDLE" : char === "1" ? "DEL" : char}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
