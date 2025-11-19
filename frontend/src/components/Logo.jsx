import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/">
      <div className="fixed left-4 top-4 z-40 flex items-center gap-3 group cursor-pointer">
        {/* Logo Image Container */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full 
                          bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20
                          blur-md opacity-0 group-hover:opacity-100
                          transition-opacity duration-500
                          -z-10"></div>
          <img
            src="/logo.jpeg"
            alt="All in Deni Logo"
            className="w-16 h-16 rounded-full object-cover 
                      transition-all duration-500 ease-in-out
                      group-hover:rotate-12 group-hover:scale-110
                      shadow-lg group-hover:shadow-2xl
                      border-2 border-transparent
                      group-hover:border-indigo-400/60
                      dark:group-hover:border-indigo-500/60
                      ring-0 group-hover:ring-4
                      ring-indigo-400/30 dark:ring-indigo-500/30"
          />
        </div>

        {/* Project Name - Hidden by default, shows on hover */}
        <div className="opacity-0 group-hover:opacity-100 
                        transform translate-x-[-20px] group-hover:translate-x-0
                        transition-all duration-500 ease-in-out
                        pointer-events-none
                        flex items-center">
          <div className="px-4 py-2 rounded-xl
                          bg-white/10 dark:bg-black/10
                          backdrop-blur-md
                          border border-indigo-400/20 dark:border-indigo-500/20
                          shadow-lg">
            <h1 className="text-2xl font-extrabold 
                          bg-clip-text text-transparent
                          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                          whitespace-nowrap
                          drop-shadow-sm">
              All in Deni
            </h1>
          </div>
        </div>
      </div>
    </Link>
  );
}

