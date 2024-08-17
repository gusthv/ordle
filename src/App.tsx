import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./Game";
import Auth from "./Auth";

const Handler = () => {
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
