// src/pages/Home.jsx
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-600">All in Deni</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Every idea becomes a project — build, connect, and grow.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <div className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">🚀 Project Hub</h2>
          <p className="text-gray-500">
            Explore and manage your Django + React projects seamlessly.
          </p>
        </div>

        <div className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">💡 New Ideas</h2>
          <p className="text-gray-500">
            Got an idea? Turn it into a project instantly and start building.
          </p>
        </div>

        <div className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition">
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
