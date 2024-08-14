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
  const [keyFeedback, setKeyFeedback] = useState<{ [key: string]: string }>({});
  const [feedBack, setFeedBackArray] = useState(
    Array.from({ length: 6 }, () => Array(5).fill(""))
  );

  const [wasBad, setWasBad] = useState(false);
  const [headerText, setHeaderText] = useState("LYCKA TILL!");
  const [hasLoaded, setHasLoaded] = useState(false);

  // const [isMobile, setIsMobile] = useState(false);

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
    // if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    //   setIsMobile(true);
    // }

    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (wonGame) {
      setHeaderText("RÄTT!");
    } else if (wasBad) {
      setHeaderText("OGILTIGT ORD!");
      // const newWordArray = wordArray.map((row) => [...row]);
      // newWordArray[cursorRow][4] = "";
      // setWordArray(newWordArray);
      // setCursorBox(4);
      setTimeout(() => {
        setHeaderText("LYCKA TILL!");
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
      <Keyboard onKeyPress={handleKeyPress} keyFeedback={keyFeedback} />
    </div>
  );
};

export default Game;
