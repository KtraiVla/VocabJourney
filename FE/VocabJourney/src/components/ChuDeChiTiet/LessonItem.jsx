import { useNavigate } from "react-router-dom";
import { Check, Lock, Play, RotateCcw, BookOpen } from "lucide-react";
import "./LessonItem.css";

export default function LessonItem(
  number,
  title,
  description,
  vocabCount,
  status,
  progress,
  alignment = "center",
) {
  const navigate = useNavigate();

  const handleStartLesson = () => {
    if (status !== "locked") {
      navigate("/dashboard/learning");
    }
  };

  const getStatusIcon = () => {
    if (status === "completed") return <Check size={20} strokeWidth={4} />;
    if (status === "locked") return <Lock size={18} strokeWidth={2.5} />;
    return number; // 'current' shows the number
  };

  const getButtonText = () => {
    if (status === "completed") return "Ôn tập lại";
    if (status === "locked") return "Hoàn thành bài học trước đã";
    return "Tiếp tục học";
  };

  const getButtonIcon = () => {
    if (status === "completed")
      return <RotateCcw size={16} strokeWidth={2.5} />;
    if (status === "locked") return <Lock size={16} strokeWidth={2.5} />;
    return <Play size={16} fill="white" />;
  };
  return (
    <div className={`lesson-item-container align-${alignment}`}>
      <div className={`lesson-item-card status-${status}`}>
        <div className="node-status-icon">{getStatusIcon()}</div>

        <h3 className="node-title">{title}</h3>
        <p className="node-description">{description}</p>

        <div className="node-badges">
          {vocabCount > 0 && (
            <div className="node-badge badge-vocab">
              <BookOpen size={14} strokeWidth={2.5} /> {vocabCount} từ vựng
            </div>
          )}
          {status === "completed" && (
            <div className="node-badge badge-completed">
              <Check size={14} strokeWidth={3} /> Hoàn thành!
            </div>
          )}
        </div>

        {status === "current" && progress !== undefined && (
          <div className="node-progress-wrapper">
            <div className="node-progress-header">
              <span>Tiến độ</span>
              <span className="node-progress-percentage">{progress}%</span>
            </div>
            <div className="node-progress-bar">
              <div
                className="node-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          className={`node-action-btn btn-${status}`}
          disabled={status === "locked"}
          onClick={handleStartLesson}
        >
          <span
            className="btn-icon"
            style={{ display: "flex", alignItems: "center" }}
          >
            {getButtonIcon()}
          </span>
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}
