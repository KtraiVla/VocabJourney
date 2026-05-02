import React from "react";
import { BookOpen, Sparkles, Play } from "lucide-react";
import "./TopicCard.css";

const overlayColors = {
  blue: {
    main: "#3b82f6",
    gradient: "linear-gradient(160deg, #3b82f6 0%, #60a5fa 100%)",
  },
  yellow: {
    main: "#d97706",
    gradient: "linear-gradient(160deg, #d97706 0%, #fbbf24 100%)",
  },
  green: {
    main: "#059669",
    gradient: "linear-gradient(160deg, #059669 0%, #34d399 100%)",
  },
  purple: {
    main: "#8b5cf6",
    gradient: "linear-gradient(160deg, #8b5cf6 0%, #a78bfa 100%)",
  },
  pink: {
    main: "#ec4899",
    gradient: "linear-gradient(160deg, #ec4899 0%, #f472b6 100%)",
  },
  teal: {
    main: "#0d9488",
    gradient: "linear-gradient(160deg, #0d9488 0%, #2dd4bf 100%)",
  },
};

export default function TopicCard({
  image,
  title,
  description,
  lessons,
  words,
  percent,
  overlay = "blue",
}) {
  const theme = overlayColors[overlay] || overlayColors.blue;

  return (
    <div className={`topic-card-v2 theme-${overlay}`}>
      <div className="card-image-section">
        <img src={image} alt={title} className="card-img" />
        <div
          className="card-overlay"
          style={{ background: theme.gradient }}
        ></div>

        <div className="card-icon-overlay">
          <div className="icon-circle">
            <BookOpen size={20} color="white" />
          </div>
        </div>

        <div className="card-badge">
          <span style={{ color: theme.main }}>{percent}%</span>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title" style={{ color: theme.main }}>
          {title}
        </h3>
        <p className="card-desc">{description}</p>

        <div className="card-stats">
          <div className="stat-item">
            <BookOpen size={14} className="stat-icon" />
            <span>{lessons} bài học</span>
          </div>
          <div className="stat-item">
            <Sparkles size={14} className="stat-icon" />
            <span>{words} từ vựng</span>
          </div>
        </div>

        <div className="card-progress-wrapper">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        <button className="continue-btn" style={{ background: theme.gradient }}>
          <Play size={16} fill="white" />
          <span>
            <Link to = "">Tiếp tục</Link>
          </span>
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}
