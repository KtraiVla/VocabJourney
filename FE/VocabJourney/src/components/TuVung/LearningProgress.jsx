import React from "react";
import "./LearningProgress.css";

export default function LearningProgress({ currentIndex, totalWords }) {
  // Tính toán phần trăm tiến độ
  const progressPercent = Math.round(((currentIndex) / totalWords) * 100);

  return (
    <div className="learning-progress-container">
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
}
