import React from "react";

export default function StatCard({
  icon,
  value,
  title,
  subtitle,
  type = "purple",
  badgeText,
  progress = 0,
}) {
  return (
    <div className={`stat-card stat-${type}`}>
      <div className="stat-card-top">
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-value">{value}</div>
      </div>

      <h3 className="stat-card-title">{title}</h3>

      {badgeText ? (
        <div className="stat-card-badge">{badgeText}</div>
      ) : (
        <>
          <div className="stat-card-progress">
            <div
              className="stat-card-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="stat-card-subtitle">{subtitle}</p>
        </>
      )}
    </div>
  );
}
