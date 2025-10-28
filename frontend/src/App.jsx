import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/quizmaster/Register";
import Login from "./pages/quizmaster/Login";
import QuizHome from "./pages/quizmaster/QuizHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quizmaster/register" element={<Register />} />
        <Route path="/quizmaster/login" element={<Login />} />
        <Route path="/quizmaster/home" element={<QuizHome />} />
      </Routes>
    </Router>
  );
}

export default App;
