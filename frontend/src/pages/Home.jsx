// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  
  const handleQuizClick = () => {
    const student = localStorage.getItem("student");
    if (student) {
      navigate("/quizmaster/home");
    } else {
      navigate("/quizmaster/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          All in Deni
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Every idea becomes a project.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {/* 🧠 Quiz Master Card */}
        <div
          onClick={handleQuizClick}
          className="bg-white shadow rounded-2xl p-6 hover:shadow-lg hover:cursor-pointer transition"
        >
          <h2 className="text-xl font-semibold mb-2">🧠 Quiz Master</h2>
          <p className="text-gray-500">
            A quiz game that allows you to test your knowledge on a variety of topics.
          </p>
        </div>

        {/* 💡 New Ideas Card */}
        <div className="bg-white shadow rounded-2xl p-6 hover:shadow-lg hover:cursor-pointer transition">
          <h2 className="text-xl font-semibold mb-2">💡 New Ideas</h2>
          <p className="text-gray-500">
            Got an idea? Turn it into a project instantly and start building.
          </p>
        </div>

        {/* 📊 Dashboard Card */}
        <div className="bg-white shadow rounded-2xl p-6 hover:shadow-lg hover:cursor-pointer transition">
          <h2 className="text-xl font-semibold mb-2">📊 Dashboard</h2>
          <p className="text-gray-500">
            Monitor your progress and project insights in real-time.
          </p>
        </div>
      </div>

      <footer className="mt-12 text-gray-400 text-sm">
        © {new Date().getFullYear()} All in Deni. Built with Django + React.
      </footer>
    </div>
  );
}
