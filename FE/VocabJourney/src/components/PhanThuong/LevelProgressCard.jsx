import React, { useState, useEffect } from "react";
import { Crown } from "lucide-react";
import "./LevelProgressCard.css";
import statsService from "../../services/statsService";

export default function LevelProgressCard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await statsService.getUserStats(maNguoiDung);
          if (response.data) {
            setStats(response.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải thông kê:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-card">Đang tải...</div>;

  const currentXP = stats?.diemKinhNghiem || 0;
  const targetXP = stats?.xpTarget || 200;
  const progress = stats?.xpProgress || 0;
  const nextLevel = (stats?.capDo || 1) + 1;

  return (
    <div className="level-progress-card reward-card-base">
      <div className="level-info-top">
        <div className="level-badge-container">
          <div className="level-icon-circle">
            <Crown size={28} color="white" />
          </div>
          <div className="level-text-info">
            <span className="label-text">Cấp Hiện Tại</span>
            <h2 className="level-display">Cấp {stats?.capDo || 1}</h2>
          </div>
        </div>
        <div className="total-xp-container">
          <span className="label-text">Tổng XP</span>
          <h2 className="xp-display">{currentXP}</h2>
        </div>
      </div>

      <div className="xp-progress-section">
        <div className="xp-labels">
          <span>Tiến độ lên Cấp {nextLevel}</span>
          <span>
            {currentXP} / {targetXP} XP
          </span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="remaining-xp-text">
          Cần {targetXP - currentXP} XP để lên cấp tiếp theo
        </p>
      </div>
    </div>
  );
}
