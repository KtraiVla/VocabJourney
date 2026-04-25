import React from "react";
import "./ChallengeProgressItem.css";

export default function ChallengeProgressItem({
  type,
  typeColor,
  typeBg,
  xp,
  title,
  description,
  current,
  total,
}) {
  const progressPercent = (current / total) * 100;

  return (
    <div className="challenge-item">
      <div className="challenge-item-header">
        <div className="challenge-type-pills">
          <span
            className="type-pill"
            style={{ color: typeColor, backgroundColor: typeBg }}
          >
            {type}
          </span>
          <span className="xp-pill">{xp} XP</span>
        </div>
      </div>

      <h4 className="challenge-title">{title}</h4>
      <p className="challenge-desc">{description}</p>

      <div className="challenge-progress-container">
        <div className="progress-labels">
          <span>Tiến độ</span>
          <span>
            {current} / {total}
          </span>
        </div>
        <div className="challenge-progress-bar">
          <div
            className="challenge-progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
