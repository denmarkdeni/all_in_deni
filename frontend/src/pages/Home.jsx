// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { FaBrain, FaLightbulb, FaChartLine } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  // Light/Dark theme detection only needed for realtime text changes
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const current = localStorage.getItem("theme") || "light";
    setTheme(current);
    document.documentElement.classList.add(current);
  }, []);

  const features = [
    {
      icon: <FaBrain />,
      title: "Quiz Master",
      description: "A quiz game that allows you to test your knowledge on a variety of topics.",
      route: () => {
        const student = localStorage.getItem("student");
        navigate(student ? "/quizmaster/home" : "/quizmaster/login");
      },
    },
    {
      icon: <FaLightbulb />,
      title: "New Ideas",
      description: "Got an idea? Turn it into a project instantly and start building.",
      route: () => navigate("/ideas"),
    },
    {
      icon: <FaChartLine />,
      title: "Dashboard",
      description: "Monitor your progress and project insights in real-time.",
      route: () => navigate("/dashboard"),
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center transition-all duration-500 px-4"
      style={{
        background: `linear-gradient(135deg,
          var(--bg-gradient-start),
          var(--bg-gradient-mid),
          var(--bg-gradient-end)
        )`,
        color: "var(--text-color)",
      }}
    >

      {/* Header */}
      <header className="text-center mb-10 mt-14">
        <h1 className="text-5xl font-extrabold drop-shadow-md bg-clip-text text-transparent
                       bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          All in Deni
        </h1>
        <p className="mt-2 text-lg opacity-80">Every idea becomes a project.</p>
      </header>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={feature.route}
            className="glass-card rounded-2xl p-6 shadow-lg
                       hover:scale-105 hover:shadow-2xl hover:cursor-pointer
                       transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              {feature.icon} {feature.title}
            </h2>
            <p className="opacity-80">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm opacity-70">
        © {new Date().getFullYear()} All in Deni. Built with Django + React.
      </footer>
    </div>
  );
}
