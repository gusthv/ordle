import {
  FC,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  // useContext,
  createContext,
} from "react";
import { wordBank } from "./data";
import Keyboard from "./Keyboard";
import Buttons from "./Buttons";
import { useNavigate } from "react-router-dom";

// import { authContext } from "./Auth";

type ContextType = {
  showStatistics: boolean;
  setShowStatistics: Dispatch<SetStateAction<boolean>>;
  showHelp: boolean;
  setShowHelp: Dispatch<SetStateAction<boolean>>;
  showAccount: boolean;
  setShowAccount: Dispatch<SetStateAction<boolean>>;
};

export const Context = createContext<ContextType>({
  showStatistics: false,
  setShowStatistics: () => {},
  showHelp: false,
  setShowHelp: () => {},
  showAccount: false,
  setShowAccount: () => {},
});

type wordProps = {
  word: string;
  tries: number;
  success: boolean;
  date: string;
};

const Game: FC = () => {
  // const { currentUsername, setCurrentUsername } = useContext(authContext);
  const [currentUser, setCurrentUser] = useState<string>(
    localStorage.getItem("username") !== null
      ? localStorage.getItem("username")!
      : ""
  );

  const [hasCheckedStatistics, setHasCheckedStatistics] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    if (currentUser === "" || currentUser === null) return;
    console.log(currentUser);
    fetchStatistics();
  }, [currentUser]);

  // const [fetchedWords, setFetchedWords] = useState<wordProps[]>([]);
  // useEffect(() => {
  //   generateStatistics();
  //   console.log("FETCHED WORDS", fetchedWords);
  // }, [fetchedWords]);

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
  const [fetchedWords, setFetchedWords] = useState<wordProps[]>([]);
  // const [isNew, setIsNew] = useState<boolean>(
  //   localStorage.getItem("isNew") !== null
  //     ? JSON.parse(localStorage.getItem("isNew")!)
  //     : false
  // );
  const [playedGames, setPlayedGames] = useState<number | null>(null);
  const [winPercentage, setWinPercentage] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  const [showStatistics, setShowStatistics] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

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
    console.log("FETCHED:", fetchedWords);
  }, [fetchedWords]);

  useEffect(() => {
    console.log(correctWord);
  }, [correctWord]);

  useEffect(() => {
    generateStatistics();
  }, [fetchedWords]);

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

    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasCheckedStatistics === null) return;
    if (fetchedWords.length > 0 && currentUser !== "") {
      generateStatistics();
    }
  }, [hasCheckedStatistics]);

  useEffect(() => {
    console.log("PLAYED GAMES", playedGames);
    console.log("WIN PERCENTAGE", winPercentage);
    console.log("CURRENT STREAK", currentStreak);
    console.log("MAX STREAK", maxStreak);
  }, [playedGames, winPercentage, currentStreak, maxStreak]);

  const generateStatistics = () => {
    if (fetchedWords.length > 0 && currentUser !== "") {
      console.log("fetching logged in stats");
      const playedGames = fetchedWords.length;
      const winPercentage = Math.round(
        (fetchedWords.filter((word) => word.success).length / playedGames) * 100
      );
      let currentStreak = 0;
      let maxStreak = 0;

      for (let i = 0; i < fetchedWords.length; i++) {
        if (fetchedWords[i].success) {
          currentStreak++;
          if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
          }
        } else {
          currentStreak = 0;
        }
      }
      // console.log(fetchedWords.length);

      setPlayedGames(playedGames);
      setWinPercentage(winPercentage);
      setCurrentStreak(currentStreak);
      setMaxStreak(maxStreak);
      setHasCheckedStatistics(true);
      return;
    } else {
      console.log("fetching localstorage stats");
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
      setHasCheckedStatistics(true);
      return;
    }
  };

  // useEffect(() => {
  //   if (playedGames === 0) {
  //     setShowHelp(true);
  //   }
  // }, [playedGames]);
  useEffect(() => {
    // SPAGHETTI DELUXE WTF
    if (hasCheckedStatistics === null) return;
    if (playedGames === 0) {
      setShowHelp(true);
    } else {
      setShowHelp(false);
    }
  }, [hasCheckedStatistics]);

  useEffect(() => {
    if (wonGame) {
      setHeaderText("RÄTT!");
      setWords((prevWords) => [
        ...prevWords,
        {
          word: correctWord,
          tries: cursorRow + 1,
          success: true,
          date: new Date().toLocaleDateString(),
        },
      ]);
      saveStatistics();
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
          tries: cursorRow + 1,
          success: false,
          date: new Date().toLocaleDateString(),
        },
      ]);
      saveStatistics();
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

  const saveStatistics = async () => {
    const token = localStorage.getItem("token");
    if (!currentUser && !token) return;
    try {
      const response = await fetch(
        "http://localhost:4000/api/ordle/saveEvents",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            word: correctWord,
            tries: cursorRow + 1,
            success: wonGame,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        fetchStatistics();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const fetchStatistics = async () => {
    if (currentUser === "") return;
    try {
      const response = await fetch(
        `http://localhost:4000/api/ordle/fetchStatistics?requestedUsername=${currentUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setFetchedWords(data.statistics.words);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const [authAction, setAuthAction] = useState<string | null>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  useEffect(() => {
    if (authAction === "") return;
    handleAuth(authAction);
  }, [authAction]);
  const handleAuth = async (authAction: string | null) => {
    if (authAction === "LOGIN") {
      if (!username || !password)
        return console.error("USERNAME OR PASSWORD IS MISSING");
      try {
        const response = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("token", data.token);
          const token = localStorage.getItem("token");
          if (token) {
            if (username) {
              // setCurrentUsername(username);
              localStorage.setItem("username", username);
              setCurrentUser(username);
              setShowAccount(false);
              localStorage.setItem("token", data.token);
              // handleClick();
            }
          }
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("ERROR", error);
      }
    } else if (authAction === "REGISTER") {
      if (!username || !password)
        return console.error("USERNAME OR PASSWORD IS MISSING");
      try {
        const response = await fetch(
          "http://localhost:4000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("token", data.token);
          const token = localStorage.getItem("token");
          if (token) {
            if (username) {
              // setCurrentUsername(username);
              localStorage.setItem("username", username);
              setCurrentUser(username);
              setShowAccount(false);
              localStorage.setItem("token", data.token);
              // handleClick();
            }
          }
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("ERROR", error);
      }
    }
  };

  return (
    <Context.Provider
      value={{
        showStatistics,
        setShowStatistics,
        showHelp,
        setShowHelp,
        showAccount,
        setShowAccount,
      }}
    >
      <div className="w-[100%] h-[100%]">
        <div
          className={`${
            showAccount === true ? "flex" : "hidden"
          } w-[100%] h-[100%] absolute flex flex-col justify-center items-center`}
        >
          <div
            className="w-[100%] h-[100%] absolute z-40 backdrop-blur-sm"
            onClick={() => {
              showAccount ? setShowAccount(false) : "";
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
                onClick={() => setShowAccount(false)}
                className="m-1 cursor-pointer"
              >
                <path
                  d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                  fill={hoveringClose ? "#62B462" : "#000000"}
                />
              </svg>
            </span>
            <span className="w-full flex flex-col items-center px-1 pb-6 chosenFont">
              <p className="text-xl font-bold">
                Välkommen, {currentUser ? currentUser : "GÄST"}!
              </p>
              <span
                onClick={() => {
                  localStorage.removeItem("words");
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  setCurrentUser("");
                  setFetchedWords([]);
                  // setPlayedGames(null);
                  // setWinPercentage(0);
                  // setCurrentStreak(0);
                  // setMaxStreak(0);
                  setWords([]);
                  /*  */
                  // navigate("/");
                  /*  */
                }}
                className={`${
                  currentUser !== "" ? "flex" : "hidden"
                } flex-col justify-center items-center mt-4 p-2 font-bold border-2 rounded-md bg-[#eeffee] hover:bg-[#62B462] cursor-pointer`}
              >
                <p>LOGGA UT</p>
                <p className="text-[12px] mt-2 text-[#808080]">
                  {"(RENSAR EXISTERANDE HISTORIK)"}
                </p>
              </span>
              <span
                className={`${
                  currentUser === "" ? "flex" : "hidden"
                } flex-col items-center gap-2 mt-6`}
              >
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
                <span className="flex flex-row items-center gap-2 mt-[8px]">
                  <p
                    className="bg-transparent hover:text-[#62B462] p-2 border-2 rounded-md text-center cursor-pointer"
                    onClick={() => setAuthAction("LOGIN")}
                  >
                    LOGIN
                  </p>
                  <p
                    className="bg-transparent hover:text-[#62B462] p-2 border-2 rounded-md text-center cursor-pointer"
                    onClick={() => setAuthAction("REGISTER")}
                  >
                    REGISTER
                  </p>
                </span>
                <p className="text-[12px] text-[#808080]">
                  {"(RENSAR EXISTERANDE HISTORIK)"}
                </p>
              </span>
            </span>
            {/* <div className="w-full h-[2px] bg-black" /> */}
          </span>
        </div>
        <div
          className={`${
            showHelp === true ? "flex" : "hidden"
          } w-[100%] h-[100%] absolute flex flex-col justify-center items-center`}
        >
          <div
            className="w-[100%] h-[100%] absolute z-40 backdrop-blur-sm"
            onClick={() => {
              showHelp ? setShowHelp(false) : "";
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
                onClick={() => setShowHelp(false)}
                className="m-1 cursor-pointer"
              >
                <path
                  d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                  fill={hoveringClose ? "#62B462" : "#000000"}
                />
              </svg>
            </span>
            <span className="w-full flex flex-col justify-start px-1 pb-1 chosenFont">
              <p className="text-xl font-bold">HOW TO PLAY</p>
              <p className="text-[18px] text-[#808080]">
                Gissa ordet på 6 försök.
              </p>
              <span className="w-full text-[14px] mt-4 flex flex-col justify-start">
                <p>● Enbart giltiga 5-bokstävers ord.</p>
                <p>● Färger på rutor efter gissningens precision.</p>
              </span>
            </span>
            <div className="w-full h-[2px] bg-black" />
            <span className="w-full flex flex-col justify-start p-1 chosenFont">
              <p>Exempel</p>
              <span>
                <span className="flex flex-row items-center mt-2 mb-1 gap-1">
                  <p className="px-2 bg-green-500 border-2 border-[black]">T</p>
                  <p className="px-2 border-2 border-[black]">R</p>
                  <p className="px-2 border-2 border-[black]">Ä</p>
                  <p className="px-2 border-2 border-[black]">S</p>
                  <p className="px-2 border-2 border-[black]">K</p>
                </span>
                <p>"T" är i ordet och är på rätt plats.</p>
              </span>
              <span>
                <span className="flex flex-row items-center mt-2 mb-1 gap-1">
                  <p className="px-2 border-2 border-[black]">K</p>
                  <p className="px-2 border-2 bg-yellow-500 border-[black]">
                    I
                  </p>
                  <p className="px-2 border-2 border-[black]">S</p>
                  <p className="px-2 border-2 border-[black]">T</p>
                  <p className="px-2 border-2 border-[black]">A</p>
                </span>
                <p>"I" finns i ordet men är på fel plats.</p>
              </span>
              <span>
                <span className="flex flex-row items-center mt-2 mb-1 gap-1">
                  <p className="px-2 border-2 border-[black]">B</p>
                  <p className="px-2 border-2 border-[black]">Ä</p>
                  <p className="px-2 border-2 border-[black]">S</p>
                  <p className="px-2 border-2 border-[black]">T</p>
                  <p className="px-2 border-2 bg-gray-500 border-[black]">A</p>
                </span>
                <p>"A" finns ej i ordet.</p>
              </span>
              <p className="text-[14px] mt-4 text-[#808080] chosenFont">
                Nytt ord dagligen varje midnatt.
              </p>
            </span>
          </span>
        </div>
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
                <p>{winPercentage ? winPercentage : "0"}</p>
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
                {currentUser !== "" && fetchedWords.length > 0
                  ? fetchedWords.reverse().map((word, index) => (
                      <p key={index} className="p-1">
                        {word.date.split("T")[0]} - {word.word} -{" "}
                        {word.success ? "RÄTT!" : "FEL!"}
                      </p>
                    ))
                  : words.reverse().map((word, index) => (
                      <p key={index} className="p-1">
                        {word.date} - {word.word} -{" "}
                        {word.success ? "RÄTT!" : "FEL!"}
                      </p>
                    ))}

                {/* {words.reverse().map((word, index) => (
                  <p key={index} className="p-1">
                    {word.date} - {word.word} -{" "}
                    {word.success ? "RÄTT!" : "FEL!"}
                  </p>
                ))} */}
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
          </div>
          <p
            className={`text-2xl ${
              endGame && wonGame
                ? "text-green-500 font-bold"
                : endGame && !wonGame
                ? "text-red-500 font-bold"
                : ""
            } ${
              headerText === "OGILTIGT ORD!" ? "text-red-500" : ""
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
