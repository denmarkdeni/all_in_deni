import React, { useState, useEffect } from "react";
import ThemeToggle from "../../components/ThemeToggle";
import AuthInput from "../../components/auth/AuthInput";
import AuthCard from "../../components/auth/AuthCard";
import PrimaryButton from "../../components/ui/PrimaryButton";

import { FaUser, FaEnvelope } from "react-icons/fa";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import { HiUserCircle } from "react-icons/hi";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const theme = localStorage.getItem("theme") || "light";

  useEffect(() => {
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/quizmaster/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    });

    if (response.ok) {
      alert("Registration successful!");
      window.location.href = "/quizmaster/login";
    } else {
      alert("Error during registration!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center transition-all duration-700 ease-in-out p-4 "
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
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-1">
          <div 
            className="animate-slideInUp"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <AuthInput
              label="Full Name"
              name="full_name"
              placeholder="Enter your full name"
              icon={<HiUserCircle />}
              onChange={handleChange}
            />
          </div>

          <div 
            className="animate-slideInUp"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            <AuthInput
              label="Username"
              name="username"
              placeholder="Choose a username"
              icon={<FaUser />}
              onChange={handleChange}
            />
          </div>

          <div 
            className="animate-slideInUp"
            style={{ animationDelay: "0.5s", animationFillMode: "both" }}
          >
            <AuthInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              icon={<FaEnvelope />}
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
              placeholder="Create a password"
              icon={<RiLockPasswordFill />}
              onChange={handleChange}
            />
          </div>

          <div 
            className="animate-slideInUp"
            style={{ animationDelay: "0.7s", animationFillMode: "both" }}
          >
            <AuthInput
              label="Confirm Password"
              type="password"
              name="confirm_password"
              placeholder="Confirm your password"
              icon={<RiLockPasswordLine />}
              onChange={handleChange}
            />
          </div>

          <div 
            className="animate-slideInUp"
            style={{ animationDelay: "0.8s", animationFillMode: "both" }}
          >
            <PrimaryButton>Register</PrimaryButton>
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
          Already have an account?{" "}
          <a 
            href="/quizmaster/login" 
            className="underline opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105 inline-block" 
            style={{ color: "var(--text-color)" }}
          >
            Login
          </a>
        </p>
      </AuthCard>
    </div>
  );
};

export default Register;
