import React from "react";
import PrimaryButton from "../ui/PrimaryButton";

export default function ActionButton({ children, onClick, variant = "primary", className = "" }) {
  if (variant === "secondary") {
    return (
      <button
        onClick={onClick}
        className={`w-full py-3 rounded-xl font-semibold
                   bg-white/20 dark:bg-black/20
                   border border-indigo-400/40 dark:border-indigo-500/40
                   hover:bg-white/30 dark:hover:bg-black/30
                   hover:scale-[1.02] active:scale-[0.98]
                   transition-all duration-300 shadow-md
                   hover:shadow-lg
                   ${className}`}
        style={{ color: "var(--text-color)" }}
      >
        {children}
      </button>
    );
  }

  return (
    <div onClick={onClick} className={className}>
      <PrimaryButton>{children}</PrimaryButton>
    </div>
  );
}

