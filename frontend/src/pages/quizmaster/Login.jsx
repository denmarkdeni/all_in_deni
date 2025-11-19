import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "../../components/auth/AuthInput";
import AuthCard from "../../components/auth/AuthCard";
import PrimaryButton from "../../components/ui/PrimaryButton";

import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const theme = localStorage.getItem("theme") || "light";

  useEffect(() => {
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://127.0.0.1:8000/api/quizmaster/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("student", data.student);
      navigate("/quizmaster/dashboard");
    } else {
      alert("Invalid credentials");
      console.log(await response.json());
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center transition-all duration-700 ease-in-out p-4"
      style={{
        background: `linear-gradient(135deg,
          var(--bg-gradient-start),
          var(--bg-gradient-mid),
          var(--bg-gradient-end)
        )`,
      }}
    >

      <AuthCard>
        <h2 
          className="text-3xl font-bold text-center mb-6 
                     bg-clip-text text-transparent
                     bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                     animate-fadeIn"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-1">
          <div 
            className="animate-slideInUp"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            <AuthInput
              label="Username"
              name="username"
              placeholder="Enter username"
              icon={<FaUser />}
              onChange={handleChange}
            />
          </div>

          <div 
            className="animate-slideInUp"
            style={{ animationDelay: "0.6s", animationFillMode: "both" }}
          >
            <AuthInput
              label="Password"
              type="password"
              name="password"
              placeholder="Enter password"
              icon={<RiLockPasswordFill />}
              onChange={handleChange}
            />
          </div>

          <div 
            className="animate-slideInUp"
            style={{ animationDelay: "0.8s", animationFillMode: "both" }}
          >
            <PrimaryButton>Login</PrimaryButton>
          </div>
        </form>

        <p 
          className="text-center mt-4 opacity-70 text-sm transition-opacity duration-300 animate-fadeIn" 
          style={{ 
            color: "var(--text-color)",
            animationDelay: "1s",
            animationFillMode: "both"
          }}
        >
          Don't have an account?{" "}
          <Link to="/quizmaster/register" 
            className="underline opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105 inline-block" 
            style={{ color: "var(--text-color)" }}
          >
            Register
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
  