import React from "react";
import { Trophy, Star, X } from "lucide-react";
import "./LevelUpModal.css";

export default function LevelUpModal({ level, onClose }) {
  return (
    <div className="levelup-overlay">
      <div className="levelup-content">
        <button className="levelup-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="levelup-header">
          <div className="trophy-wrapper">
            <Trophy size={60} color="#f59e0b" fill="#fef3c7" />
            <div className="star-particles">
              <Star className="p-1" size={16} fill="#fbbf24" color="#fbbf24" />
              <Star className="p-2" size={20} fill="#fbbf24" color="#fbbf24" />
              <Star className="p-3" size={14} fill="#fbbf24" color="#fbbf24" />
            </div>
          </div>
          <h2>Chúc Mừng!</h2>
          <p>Bạn đã đạt đến cấp độ mới</p>
        </div>

        <div className="levelup-badge">
          <span className="level-text">CẤP ĐỘ</span>
          <span className="level-number">{level}</span>
        </div>

        <div className="levelup-footer">
          <p>Bạn đang tiến bộ rất nhanh! Hãy tiếp tục duy trì phong độ này nhé.</p>
          <button className="levelup-btn" onClick={onClose}>
            Tuyệt vời!
          </button>
        </div>
      </div>
    </div>
  );
}
