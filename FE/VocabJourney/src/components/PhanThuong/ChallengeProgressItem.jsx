import React from "react";
import "./ChallengeProgressItem.css";

export default function ChallengeProgressItem({
  type = "Hàng Ngày",
  title,
  desc,
  reward,
  progress,
  total,
}) {
  const isWeekly = type.toLowerCase().includes("tuần");
  const progressPercent = Math.min((progress / total) * 100, 100);

  return (
    <div className="reward-challenge-card">
      <div className="reward-challenge-top">
        <div className="reward-challenge-badges">
          <span className={`type-badge ${isWeekly ? "weekly" : "daily"}`}>
            {isWeekly ? "📊 Hàng Tuần" : "🗓️ Hàng Ngày"}
          </span>
          <span className="reward-xp-text">{reward} XP</span>
        </div>
      </div>

      <h4 className="reward-challenge-title">{title}</h4>
      <p className="reward-challenge-desc">{desc}</p>

      <div className="reward-challenge-progress-section">
        <div className="progress-info-row">
          <span className="progress-label">Tiến độ</span>
          <span className="progress-value">{progress} / {total}</span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
