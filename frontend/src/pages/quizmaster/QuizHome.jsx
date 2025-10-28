import React, { useEffect, useState } from "react";

const QuizHome = () => {
  const student = localStorage.getItem("student");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow p-6 rounded-2xl w-96 text-center">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {student}!</h2>
        <p className="text-gray-500 mb-4">Here is your question paper 🎯</p>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizHome;
