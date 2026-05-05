import "./TopicDetailBanner.css";
import { BookOpen, Sparkles, Target, Map } from "lucide-react";

export default function TopicDetailBanner({
  title,
  description,
  stats,
  progress,
  image, // Thêm prop image
}) {
  return (
    <div className="topic-banner">
      <div 
        className="topic-banner-image-section"
        style={image ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${image})` } : {}}
      >
        <div className="topic-banner-content">
          <div className="topic-banner-header">
            <div className="topic-title-group">
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            <div className="topic-icon-container">🦉</div>
          </div>

          <div className="topic-stats-row">
            <div className="topic-stat-badge">
              <span className="badge-emoji">📚</span> {stats.lessons} bài học
            </div>
            <div className="topic-stat-badge">
              <span className="badge-emoji">✨</span> {stats.vocab} từ vựng
            </div>
            <div className="topic-stat-badge">
              <span className="badge-emoji">🎯</span> {stats.completedRate}%
              hoàn thành
            </div>
          </div>
        </div>
      </div>

      <div className="topic-progress-section">
        <div className="progress-header">
          <span className="progress-label">Tiến độ của bạn</span>
          <span className="progress-percentage">{progress}%</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
