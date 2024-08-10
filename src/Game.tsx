import { useState, useEffect } from "react";
import { wordBank } from "./data";
import Keyboard from "./Keyboard";

const Game = () => {
  const [wonGame, setWonGame] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [cursorRow, setCursorRow] = useState(0);
  const [cursorBox, setCursorBox] = useState(0);
  const [wordArray, setWordArray] = useState(
    Array.from({ length: 6 }, () => Array(5).fill(""))
  );
  const [feedBack, setFeedBackArray] = useState(
    Array.from({ length: 6 }, () => Array(5).fill(""))
  );

  const [hasLoaded, setHasLoaded] = useState(false);
  const [headerText, setHeaderText] = useState("LYCKA TILL!");

  const [isMobile, setIsMobile] = useState(false);

  const sortedWordBank = wordBank
    .split("\n")
    .map((word: string) => word.trim())
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
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      setIsMobile(true);
    }

    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (wonGame) {
      setHeaderText("RÄTT!");
    }
  }, [wonGame]);

  const createFeedBack = (row: string[]): string[] => {
    const feedBackRow = Array(5).fill("");
    for (let i = 0; i < 5; i++) {
      if (row[i] === correctWord[i]) {
        feedBackRow[i] = "+";
      } else if (correctWord.includes(row[i])) {
        feedBackRow[i] = "-";
      } else {
        feedBackRow[i] = "0";
      }
    }
    return feedBackRow;
  };

  const SubmitFinalAttempt = () => {
    if (wordArray[cursorRow].join("") === correctWord) {
      setWonGame(true);
      setEndGame(true);
    } else {
      setHeaderText(`FEL! ORDET VAR: ${correctWord}`);
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

    if (key === "ENTER" && cursorBox === 5) {
      const feedBackForRow = createFeedBack(wordArray[cursorRow]);
      const newFeedBackArray = feedBack.map((row) => [...row]);
      newFeedBackArray[cursorRow] = feedBackForRow;
      setFeedBackArray(newFeedBackArray);

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

  return (
    <div
      className={`w-screen h-screen flex flex-col justify-center items-center ${
        hasLoaded ? "transitionRight" : "initialPosition"
      } transition-transform ease-in-out`}
    >
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
      <div className="flex flex-col pt-6">
        {wordArray.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row gap-[4px]">
            {row.map((letter, boxIndex) => (
              <p
                key={boxIndex}
                className={`w-12 h-12 flex flex-row justify-center items-center ${
                  rowIndex === 0 ? "" : "mt-[4px]"
                } border-[2px] font-bold ${
                  cursorRow === rowIndex && cursorBox === boxIndex + 1
                    ? "pulse"
                    : ""
                } ${
                  cursorRow === rowIndex && cursorBox === boxIndex
                    ? "flashing"
                    : ""
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
      {isMobile ? <Keyboard onKeyPress={handleKeyPress} /> : null}
    </div>
  );
};

export default Game;
