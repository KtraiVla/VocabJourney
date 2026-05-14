import React from "react";
import "./ChallengeItem.css";
import { CheckCircle2, BookOpen, RefreshCw, Trophy, Zap, Brain, Star } from "lucide-react";

export default function ChallengeItem({
  title,
  desc,
  reward,
  progress,
  total,
}) {
  const isCompleted = progress >= total;
  const width = `${Math.min((progress / total) * 100, 100)}%`;

  // Tự động chọn Icon dựa trên tiêu đề
  const getIcon = () => {
    const t = title.toLowerCase();
    if (t.includes("học")) return <BookOpen size={20} />;
    if (t.includes("ôn")) return <RefreshCw size={20} />;
    if (t.includes("quiz") || t.includes("kiểm tra")) return <Zap size={20} />;
    if (t.includes("trí tuệ")) return <Brain size={20} />;
    if (t.includes("combo")) return <Star size={20} />;
    return <Trophy size={20} />;
  };

  return (
    <div className={`challenge-item ${isCompleted ? "completed" : ""}`}>
      <div className="challenge-item-top">
        <div className="challenge-icon-wrapper">
          {isCompleted ? <CheckCircle2 size={20} color="#22c55e" /> : getIcon()}
        </div>
        <div className="challenge-info">
          <h4>{title}</h4>
          <p>{desc}</p>
        </div>
        <div className="challenge-reward-pill">+{reward} XP</div>
      </div>

      <div className="challenge-progress-wrapper">
        <div className="challenge-progress-container">
          <div className="challenge-progress-bar" style={{ width }}></div>
        </div>
        <div className="challenge-count">
          {progress}/{total}
        </div>
      </div>
    </div>
  );
}
