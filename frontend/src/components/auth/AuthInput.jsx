import React from "react";

export default function AuthInput({ label, icon, ...rest }) {
  return (
    <div className="mb-5">
      <label 
        className="text-sm font-medium opacity-80 transition-all duration-300" 
        style={{ color: "var(--text-color)" }}
      >
        {label}
      </label>

      <div className="group flex items-center gap-2 mt-1 
                      border border-gray-300/40 dark:border-gray-700/40
                      rounded-xl px-4 py-3 
                      bg-white/20 dark:bg-black/20 
                      backdrop-blur-sm
                      transition-all duration-300 ease-in-out
                      hover:border-indigo-400/60 dark:hover:border-indigo-500/60
                      hover:bg-white/30 dark:hover:bg-black/30
                      focus-within:border-indigo-500/80 dark:focus-within:border-indigo-400/80
                      focus-within:bg-white/40 dark:focus-within:bg-black/40
                      focus-within:shadow-sm focus-within:shadow-indigo-500/20
                      focus-within:scale-[1.01]">

        <span className="text-xl opacity-70 transition-all duration-300 group-focus-within:opacity-100" 
        style={{ color: "var(--text-color)" }}>{icon}</span>

        <input  
          {...rest}
          className="w-full bg-transparent outline-none placeholder-gray-500 dark:placeholder-gray-400
                     transition-all duration-300"
          style={{ color: "var(--text-color)" }}
          required
        />
      </div>
    </div>
  );
}
