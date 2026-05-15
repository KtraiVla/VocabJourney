import { Lock } from "lucide-react";
import "./BadgeCard.css";

export default function BadgeCard({
  name,
  description,
  requirement,
  date,
  icon,
  unlocked,
  currentProgress,
  targetProgress,
  percentage,
  bgColor,
  borderColor,
}) {
  return (
    <div
      className={`badge-card ${unlocked ? "unlocked" : "locked"}`}
      style={
        unlocked
          ? { backgroundColor: bgColor, border: `2px solid ${borderColor}` }
          : {}
      }
    >
      <div className="badge-icon-container">
        <span className="main-icon">{icon}</span>
        {!unlocked && <div className="lock-overlay"><Lock size={14} /></div>}
      </div>
      <h4 className="badge-name">{name}</h4>
      
      {unlocked ? (
        <p className="badge-desc">{description}</p>
      ) : (
        <div className="badge-requirement">
          <span className="req-label">Nhiệm vụ:</span>
          <p>{requirement || "Đang cập nhật..."}</p>
        </div>
      )}

      {/* Thanh tiến độ cho các huy hiệu chưa mở */}
      {!unlocked && (
        <div className="badge-progress-container">
          <div className="badge-progress-header">
            <span>{percentage}%</span>
            <span>{currentProgress}/{targetProgress}</span>
          </div>
          <div className="badge-progress-track">
            <div className="badge-progress-fill" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      )}

      <div className="badge-status">
        {unlocked ? (
          <span className="unlocked-date">{date || "Đã đạt được"}</span>
        ) : (
          <span className="locked-text">Chưa đạt được</span>
        )}
      </div>
    </div>
  );
}
