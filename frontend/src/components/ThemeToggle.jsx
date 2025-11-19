// src/components/ThemeToggle.jsx
import React, { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full text-lg 
                bg-white/40 dark:bg-black/30 hover:cursor-pointer
                border border-gray-300 dark:border-gray-700
                backdrop-blur-md transition-all duration-300
                hover:scale-110"
    >
      {theme === "light" ? <BsMoon /> : <BsSun />}
    </button>
  );
}
