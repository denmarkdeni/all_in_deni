import React from "react";
import DashboardCard from "./DashboardCard";

export default function StatCard({ icon, title, value, subtitle, className = "" }) {
  return (
    <DashboardCard className={`text-center ${className}`}>
      <div className="flex justify-center mb-3 text-4xl opacity-80" style={{ color: "var(--text-color)" }}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-1" style={{ color: "var(--text-color)" }}>
        {value}
      </h3>
      <p className="text-sm opacity-70 mb-1" style={{ color: "var(--text-color)" }}>
        {title}
      </p>
      {subtitle && (
        <p className="text-xs opacity-60" style={{ color: "var(--text-color)" }}>
          {subtitle}
        </p>
      )}
    </DashboardCard>
  );
}

