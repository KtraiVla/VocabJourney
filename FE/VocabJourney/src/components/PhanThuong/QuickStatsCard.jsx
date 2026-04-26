import { Star } from "lucide-react";
import { BookOpen, Target, Award, Calendar } from "lucide-react";
import "./QuickStatsCard.css";

export default function QuickStatsCard() {
  const stats = [
    { label: "Từ Đã Học", value: 347, color: "#3b82f6" },
    { label: "Bài Kiểm Tra Đã Qua", value: 47, color: "#a855f7" },
    { label: "Điểm Hoàn Hảo", value: 12, color: "#10b981" },
    { label: "Ngày Học Tập", value: 89, color: "#f59e0b" },
  ];

  return (
    <div className="quick-stats-card reward-card-base">
      <div className="stats-header">
        <Star size={18} color="#f59e0b" fill="#f59e0b" />
        <h3>Thống Kê Nhanh</h3>
      </div>

      <div className="stats-list">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-row">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
