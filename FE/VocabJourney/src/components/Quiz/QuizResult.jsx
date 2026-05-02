import React from "react";
import { Trophy, RotateCcw, Home, Star } from "lucide-react";
import "./QuizResult.css";

export default function QuizResult({ score, total, onRestart, onBack }) {
  const percentage = Math.round((score / total) * 100);
  
  let message = "";
  let iconColor = "";
  
  if (percentage === 100) {
    message = "Tuyệt vời! Bạn là một bậc thầy từ vựng!";
    iconColor = "#eab308"; // Gold
  } else if (percentage >= 75) {
    message = "Rất tốt! Bạn đang tiến bộ rất nhanh.";
    iconColor = "#0ea5e9"; // Blue
  } else if (percentage >= 50) {
    message = "Khá lắm! Hãy cố gắng luyện tập thêm nhé.";
    iconColor = "#10b981"; // Green
  } else {
    message = "Đừng nản lòng! Hãy học lại và thử sức lần nữa.";
    iconColor = "#64748b"; // Gray
  }

  return (
    <div className="quiz-result-container">
      <div className="quiz-result-card">
        <div className="trophy-wrapper" style={{ color: iconColor }}>
          <Trophy size={80} />
          <div className="stars-decoration">
            <Star className="star s1" size={20} fill="currentColor" />
            <Star className="star s2" size={24} fill="currentColor" />
            <Star className="star s3" size={20} fill="currentColor" />
          </div>
        </div>
        
        <h2 className="result-title">Hoàn thành bài kiểm tra!</h2>
        <p className="result-message">{message}</p>
        
        <div className="score-display">
          <div className="score-circle">
            <span className="score-number">{score}</span>
            <span className="score-total">/{total}</span>
          </div>
          <p className="score-label">Câu trả lời đúng</p>
        </div>
        
        <div className="result-stats">
          <div className="stat-item">
            <span className="stat-value">{percentage}%</span>
            <span className="stat-label">Chính xác</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">+{score * 10}</span>
            <span className="stat-label">Kinh nghiệm (XP)</span>
          </div>
        </div>
        
        <div className="result-actions">
          <button className="btn-restart-quiz" onClick={onRestart}>
            <RotateCcw size={20} />
            Làm lại bài thi
          </button>
          <button className="btn-go-home" onClick={onBack}>
            <Home size={20} />
            Về trang chủ đề
          </button>
        </div>
      </div>
    </div>
  );
}
