import React from "react";

export default function DashboardCard({ children, className = "", onClick }) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 shadow-lg
                  transition-all duration-300
                  ${onClick ? "hover:scale-105 hover:shadow-2xl hover:cursor-pointer" : ""}
                  ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

