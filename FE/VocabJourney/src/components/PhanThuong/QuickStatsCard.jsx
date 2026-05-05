import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import "./QuickStatsCard.css";
import statsService from "../../services/statsService";

export default function QuickStatsCard() {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await statsService.getUserStats(maNguoiDung);
          if (response.data) {
            setUserStats(response.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-card">...</div>;

  const statsList = [
    { label: "Từ Đã Học", value: userStats?.tongTuDaHoc || 0, color: "#3b82f6" },
    { label: "Bài Kiểm Tra", value: userStats?.tongQuizDaLam || 0, color: "#a855f7" },
    { label: "XP Hiện Có", value: userStats?.diemKinhNghiem || 0, color: "#10b981" },
    { label: "Chuỗi Ngày", value: userStats?.chuoiNgayHoc || 0, color: "#f59e0b" },
  ];

  return (
    <div className="quick-stats-card reward-card-base">
      <div className="quick-stats-header">
        <Star size={18} color="#f59e0b" fill="#f59e0b" />
        <h3>Thống Kê Nhanh</h3>
      </div>

      <div className="stats-list">
        {statsList.map((stat, idx) => (
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
