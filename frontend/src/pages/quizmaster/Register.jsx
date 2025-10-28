import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow p-6 rounded-2xl w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          {["full_name", "username", "email", "password", "confirm_password"].map((field) => (
            <input
              key={field}
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={field.replace("_", " ").toUpperCase()}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-2"
              required
            />
          ))}
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
