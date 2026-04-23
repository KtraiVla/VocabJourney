import React from "react";

export default function StatCard({
  icon,
  value,
  title,
  subtitle,
  type = "purple",
  badgeText,
  progress = 0
}) {
  // Quản lý màu nền dựa trên prop 'type'
  const gradients = {
    purple: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    blue: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    orange: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    green: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
  };

  return (
    <div 
      className="stat-card-premium"
      style={{ background: gradients[type] || gradients.purple }}
    >
      <div className="stat-card-top">
        <div className="stat-icon-wrapper">{icon}</div>
        <div className="stat-value-large">{value}</div>
      </div>

      <div className="stat-label-premium">{title}</div>

      <div className="stat-card-bottom">
        {badgeText ? (
          <div className="stat-badge-premium">{badgeText}</div>
        ) : (
          <div className="stat-progress-container">
            <div className="stat-progress-bar-bg">
              <div 
                className="stat-progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="stat-progress-text">{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
}
