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
  const characterArray = ["QWERTYUIOPÅ", "ASDFGHJKLÖÄ", "0ZXCVBNM1"];

  const handleKeyboardPress = (e: React.MouseEvent<HTMLButtonElement>) => {
    const char = e.currentTarget.textContent || "";
    onKeyPress(char);
  };

  return (
    <div className={`${!isMobile ? "w-[312px]" : "w-[95%]"} mt-6`}>
      {characterArray.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center items-center gap-1 text-[0.8rem]"
        >
          {row.split("").map((char, charIndex) => (
            <button
              key={charIndex}
              className={`${
                char === "0" || char === "1" ? "w-16 h-14" : "w-10 h-14"
              } flex flex-grow justify-center items-center mt-1 border-2 font-bold ${
                keyFeedback[char] === "green"
                  ? "bg-green-500"
                  : keyFeedback[char] === "yellow"
                  ? "bg-yellow-500"
                  : keyFeedback[char] === "grey"
                  ? "bg-gray-500"
                  : ""
              }`}
              onClick={handleKeyboardPress}
            >
              {char === "0" ? "ENTER" : char === "1" ? "DEL" : char}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
