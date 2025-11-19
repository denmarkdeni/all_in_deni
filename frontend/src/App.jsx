import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/quizmaster/Register";
import Login from "./pages/quizmaster/Login";
import QuizDashboard from "./pages/quizmaster/QuizDashboard";
import ThemeToggle from "./components/ThemeToggle";
import Logo from "./components/Logo";

function App() {
  return (
    <Router>
      <Logo />
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quizmaster/register" element={<Register />} />
        <Route path="/quizmaster/login" element={<Login />} />
        <Route path="/quizmaster/home" element={<QuizDashboard />} />
        <Route path="/quizmaster/dashboard" element={<QuizDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
