import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/quizmaster/Register";
import Login from "./pages/quizmaster/Login";
import QuizDashboard from "./pages/quizmaster/QuizDashboard";
import CreateBatch from "./pages/quizmaster/CreateBatch";
import CreateQuiz from "./pages/quizmaster/CreateQuiz";
import QuizList from "./pages/quizmaster/QuizList";
import TakeQuiz from "./pages/quizmaster/TakeQuiz";
import ViewResults from "./pages/quizmaster/ViewResults";
import Profile from "./pages/quizmaster/Profile";
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
        <Route path="/quizmaster/create-batch" element={<CreateBatch />} />
        <Route path="/quizmaster/create-quiz" element={<CreateQuiz />} />
        <Route path="/quizmaster/quizzes" element={<QuizList />} />
        <Route path="/quizmaster/take-quiz/:quizId" element={<TakeQuiz />} />
        <Route path="/quizmaster/quiz/:quizId/results" element={<ViewResults />} />
        <Route path="/quizmaster/results" element={<ViewResults />} />
        <Route path="/quizmaster/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
