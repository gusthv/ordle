interface KeyboardProps {
  onKeyPress: (key: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
  const characterArray = ["QWERTYUIOPÅ", "ASDFGHJKLÖÄ", "0ZXCVBNM1"];

  const handleKeyboardPress = (e: React.MouseEvent<HTMLButtonElement>) => {
    const char = e.currentTarget.textContent || "";
    onKeyPress(char);
  };

  return (
    <div className="fixed bottom-0 mb-12">
      {characterArray.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-row justify-center items-center gap-1 text-[0.8rem]"
        >
          {row.split("").map((char, charIndex) => (
            <button
              key={charIndex}
              className={`${
                char === "0" || char === "1" ? "w-14 h-6" : "w-6 h-6"
              } mt-1 border-2 font-bold`}
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
