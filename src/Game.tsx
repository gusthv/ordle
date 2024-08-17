import {
  FC,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  createContext,
} from "react";
import { wordBank } from "./data";
import Keyboard from "./Keyboard";
import Buttons from "./Buttons";
import { useNavigate } from "react-router-dom";

type ContextType = {
  showStatistics: boolean;
  setShowStatistics: Dispatch<SetStateAction<boolean>>;
};

export const Context = createContext<ContextType>({
  showStatistics: false,
  setShowStatistics: () => {},
});

type wordProps = {
  word: string;
  success: boolean;
  date: string;
};

const Game: FC = () => {
  const [wonGame, setWonGame] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [cursorRow, setCursorRow] = useState(0);
  const [cursorBox, setCursorBox] = useState(0);
  const [wordArray, setWordArray] = useState(
    Array.from({ length: 6 }, () => Array(5).fill(""))
  );
  const [keyFeedback, setKeyFeedback] = useState<{ [key: string]: string }>({});
  const [feedBack, setFeedBackArray] = useState(
    Array.from({ length: 6 }, () => Array(5).fill(""))
  );

  const [hoveringClose, setHoveringClose] = useState(false);

  const [wasBad, setWasBad] = useState(false);
  const [headerText, setHeaderText] = useState("LYCKA TILL!");
  const [hasLoaded, setHasLoaded] = useState(false);

  const [words, setWords] = useState<wordProps[]>(
    localStorage.getItem("words") !== null
      ? JSON.parse(localStorage.getItem("words")!)
      : []
  );
  const [playedGames, setPlayedGames] = useState(0);
  const [winPercentage, setWinPercentage] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  const [showStatistics, setShowStatistics] = useState(false);

  const sortedWordBank = wordBank
    .split("\n")
    .map((word: string) => word.trim().toUpperCase())
    .filter((word: string) => word.length > 0);

  const [correctWord] = useState(
    sortedWordBank[
      Math.floor(Math.random() * sortedWordBank.length)
    ].toUpperCase()
  );

  useEffect(() => {
    console.log(correctWord);
  }, [correctWord]);

  useEffect(() => {
    console.log(words);
    generateStatistics();
    localStorage.setItem("words", JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      setIsMobile(true);
    }

    // generateStatistics();

    window.scrollTo(0, 1);

    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const generateStatistics = () => {
    const playedGames = words.length;
    const winPercentage = Math.round(
      (words.filter((word) => word.success).length / playedGames) * 100
    );
    let currentStreak = 0;
    let maxStreak = 0;

    for (let i = 0; i < words.length; i++) {
      if (words[i].success) {
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }

    setPlayedGames(playedGames);
    setWinPercentage(winPercentage);
    setCurrentStreak(currentStreak);
    setMaxStreak(maxStreak);
  };

  useEffect(() => {
    if (wonGame) {
      setHeaderText("RÄTT!");
      setWords((prevWords) => [
        ...prevWords,
        {
          word: correctWord,
          success: true,
          date: new Date().toLocaleDateString(),
        },
      ]);
    } else if (wasBad) {
      setHeaderText("OGILTIGT ORD!");
      // const newWordArray = wordArray.map((row) => [...row]);
      // newWordArray[cursorRow][4] = "";
      // setWordArray(newWordArray);
      // setCursorBox(4);
      setTimeout(() => {
        setHeaderText("LYCKA TILL!");
      }, 500);
      setTimeout(() => {
        // setHeaderText("LYCKA TILL!");
        const newWordArray = wordArray.map((row) => [...row]);
        newWordArray[cursorRow][4] = "";
        setWordArray(newWordArray);
        setCursorBox(4);
        setWasBad(false);
      }, 250);
    }
  }, [wonGame, wasBad]);

  // const createFeedBack = (row: string[]): string[] => {
  //   const feedBackRow = Array(5).fill("");
  //   for (let i = 0; i < 5; i++) {
  //     if (row[i] === correctWord[i]) {
  //       feedBackRow[i] = "+";
  //     } else if (correctWord.includes(row[i])) {
  //       feedBackRow[i] = "-";
  //     } else {
  //       feedBackRow[i] = "0";
  //     }
  //   }
  //   return feedBackRow;
  // };

  const createFeedBack = (row: string[]): string[] => {
    const feedBackRow = Array(5).fill("0");
    const correctWordLetters = correctWord.split("");
    const rowLetters = row.slice();

    for (let i = 0; i < 5; i++) {
      if (row[i] === correctWord[i]) {
        feedBackRow[i] = "+";
        correctWordLetters[i] = "";
        rowLetters[i] = "";
      }
    }
    for (let i = 0; i < 5; i++) {
      if (rowLetters[i] && correctWordLetters.includes(rowLetters[i])) {
        feedBackRow[i] = "-";
        const indexInCorrectWord = correctWordLetters.indexOf(rowLetters[i]);
        correctWordLetters[indexInCorrectWord] = "";
        rowLetters[i] = "";
      }
    }
    return feedBackRow;
  };

  const updateKeyFeedback = (row: string[], feedback: string[]) => {
    const newKeyFeedback = { ...keyFeedback };

    for (let i = 0; i < row.length; i++) {
      const letter = row[i];
      const feedbackForLetter = feedback[i];

      if (feedbackForLetter === "+") {
        newKeyFeedback[letter] = "green";
      } else if (feedbackForLetter === "-") {
        // Only update to yellow if it hasn't already been marked green
        if (newKeyFeedback[letter] !== "green") {
          newKeyFeedback[letter] = "yellow";
        }
      } else if (feedbackForLetter === "0") {
        // Only update to grey if it hasn't already been marked yellow or green
        if (!newKeyFeedback[letter]) {
          newKeyFeedback[letter] = "grey";
        }
      }
    }

    setKeyFeedback(newKeyFeedback);
  };

  const SubmitFinalAttempt = () => {
    if (wordArray[cursorRow].join("") === correctWord) {
      setWonGame(true);
      setEndGame(true);
    } else {
      setHeaderText(`FEL! DET VAR: ${correctWord}`);
      setWords((prevWords) => [
        ...prevWords,
        {
          word: correctWord,
          success: false,
          date: new Date().toLocaleDateString(),
        },
      ]);
      setEndGame(true);
    }
  };

  const handleKeyPress = (key: string): void => {
    if (endGame) return;

    if (key === "DEL" || key === "BACKSPACE") {
      if (cursorBox > 0 && cursorBox <= 5) {
        const newWordArray = wordArray.map((row) => [...row]);
        newWordArray[cursorRow][cursorBox - 1] = "";
        setWordArray(newWordArray);
        setCursorBox(cursorBox - 1);
      }
      return;
    }

    if (
      (key === "ENTER" && cursorBox === 5) ||
      (key === "ORDLE" && cursorBox === 5)
    ) {
      if (!sortedWordBank.includes(wordArray[cursorRow].join(""))) {
        // setHeaderText("OGILTIGT ORD!");
        setWasBad(true);

        // const newWordArray = wordArray.map((row) => [...row]);
        // newWordArray[cursorRow][4] = "";
        // setWordArray(newWordArray);
        // setCursorBox(4);
        return;
      }

      const feedBackForRow = createFeedBack(wordArray[cursorRow]);
      const newFeedBackArray = feedBack.map((row) => [...row]);
      newFeedBackArray[cursorRow] = feedBackForRow;
      setFeedBackArray(newFeedBackArray);

      updateKeyFeedback(wordArray[cursorRow], feedBackForRow);

      if (wordArray[cursorRow].join("") === correctWord) {
        SubmitFinalAttempt();
        return;
      }

      if (cursorRow < 5) {
        setCursorRow(cursorRow + 1);
        setCursorBox(0);
      } else {
        SubmitFinalAttempt();
      }
      return;
    }

    if (cursorBox === 5) return;
    if (key.length === 1 && /[A-ZÅÄÖ]/.test(key)) {
      const newWordArray = wordArray.map((row) => [...row]);
      newWordArray[cursorRow][cursorBox] = key;
      setWordArray(newWordArray);

      if (cursorBox <= 4) {
        setCursorBox(cursorBox + 1);
      }
    }
  };

  useEffect(() => {
    const handlePhysicalKeyPress = (e: KeyboardEvent): void => {
      handleKeyPress(e.key.toUpperCase());
    };

    window.addEventListener("keydown", handlePhysicalKeyPress);
    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyPress);
    };
  }, [cursorBox, cursorRow, wordArray, endGame]);

  const navigate = useNavigate();

  return (
    <Context.Provider
      value={{
        showStatistics,
        setShowStatistics,
      }}
    >
      <div className="w-[100%] h-[100%]">
        <div
          className={`${
            showStatistics ? "flex" : "hidden"
          } w-[100%] h-[100%] absolute flex flex-col justify-center items-center`}
        >
          <div
            className="w-[100%] h-[100%] absolute z-40 backdrop-blur-sm"
            onClick={() => {
              showStatistics ? setShowStatistics(false) : "";
            }}
          />
          {/* w-[312px] */}
          <span
            className={`${
              isMobile ? "w-[80%]" : "w-[312px]"
            } flex flex-col justify-center items-center bg-[#eeffee] border-2 shadow-2xl rounded-md z-50`}
          >
            <span className="w-full flex flex-row justify-end">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                onMouseEnter={() => setHoveringClose(true)}
                onMouseLeave={() => setHoveringClose(false)}
                onClick={() => setShowStatistics(false)}
                className="m-1 cursor-pointer"
              >
                <path
                  d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                  fill={hoveringClose ? "#62B462" : "#000000"}
                />
              </svg>
            </span>
            <p className="w-full flex justify-start p-1 text-xl chosenFont">
              STATISTICS
            </p>
            <div className="w-full h-[2px] bg-black" />
            <span className="w-full flex flex-row justify-between items-center p-4">
              <span className="flex flex-col items-center">
                <p>{playedGames}</p>
                <p className="text-[14px] text-[#808080]">Played</p>
              </span>
              <span className="flex flex-col items-center">
                <p>{winPercentage}</p>
                <p className="text-[14px] text-[#808080]">Win %</p>
              </span>
              <span className="flex flex-col items-center">
                <p>{currentStreak}</p>
                <span className="flex flex-col items-center text-[14px] text-[#808080]">
                  <p>Current</p>
                  <p>Streak</p>
                </span>
              </span>
              <span className="flex flex-col items-center">
                <p>{maxStreak}</p>
                <span className="flex flex-col items-center text-[14px] text-[#808080]">
                  <p>Max</p>
                  <p>Streak</p>
                </span>
              </span>
            </span>
            <p className="w-full flex p-1 text-xl chosenFont">WORDS</p>
            <span className="w-full chosenFont h-[200px] overflow-y-scroll">
              <span>
                {words.reverse().map((word, index) => (
                  <p key={index} className="p-1">
                    {word.date} - {word.word} -{" "}
                    {word.success ? "RÄTT!" : "FEL!"}
                  </p>
                ))}
              </span>
            </span>
            {/* <div className="w-full h-[312px] mt-6 bg-green-500" /> */}
          </span>
        </div>
        <div
          className={`w-full h-full flex flex-col justify-center items-center ${
            hasLoaded ? "transitionRight" : "initialPosition"
          } transition-transform ease-in-out select-none z-30`}
        >
          <div className="w-[312px] mb-6">
            <span className="w-full flex justify-between py-2">
              <p
                className="text-2xl chosenFont hover:text-[#62B462] cursor-pointer"
                onClick={() => {
                  navigate("/");
                }}
              >
                Ordle
              </p>
              <Buttons />
            </span>
            <div className="h-[2px] bg-black" />
            <p className="mt-2 text-[14px] text-[#808080] text-center">
              Wordle in Swedish
            </p>
          </div>
          <p
            className={`text-2xl ${
              endGame && wonGame
                ? "text-green-500 font-bold"
                : endGame && !wonGame
                ? "text-red-500 font-bold"
                : ""
            } chosenFont`}
          >
            {headerText}
          </p>
          <div className="w-[90%] flex flex-col items-center mt-6">
            {wordArray.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-[4px]">
                {row.map((letter, boxIndex) => (
                  <p
                    key={boxIndex}
                    className={`w-14 h-14 flex flex-wrap justify-center items-center ${
                      rowIndex === 0 ? "" : "mt-[4px]"
                    } border-[2px] rounded-md font-bold ${
                      cursorRow === rowIndex && cursorBox === boxIndex + 1
                        ? "pulse"
                        : ""
                    } ${
                      cursorRow === rowIndex && cursorBox === boxIndex
                        ? "flashing"
                        : ""
                    } ${
                      cursorRow === rowIndex && wasBad ? "bg-red-500 pulse" : ""
                    } ${
                      feedBack[rowIndex][boxIndex] === "+"
                        ? "bg-green-500"
                        : feedBack[rowIndex][boxIndex] === "-"
                        ? "bg-yellow-500"
                        : feedBack[rowIndex][boxIndex] === "0"
                        ? "bg-gray-500"
                        : ""
                    }`}
                  >
                    {letter}
                  </p>
                ))}
              </div>
            ))}
          </div>
          {/* {isMobile ? <Keyboard onKeyPress={handleKeyPress} /> : null} */}
          <Keyboard
            onKeyPress={handleKeyPress}
            keyFeedback={keyFeedback}
            isMobile={isMobile}
          />
        </div>
      </div>
    </Context.Provider>
  );
};

export default Game;
