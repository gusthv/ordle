import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./Game";
import Auth from "./Auth";

const Handler = () => {
  return (
    <div className="w-screen h-screen overflow-hidden">
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
