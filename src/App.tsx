import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./Auth";
import Game from "./Game";

const Handler = () => {
  useEffect(() => {
    // localStorage.removeItem("username");
    window.scrollTo(0, 1);
  }, []);
  return (
    <div className="w-[100dvw] h-[100dvh] overflow-hidden">
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
};

export default Handler;
