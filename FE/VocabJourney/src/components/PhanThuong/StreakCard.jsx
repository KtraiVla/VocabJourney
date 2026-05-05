import React, { useState, useEffect } from "react";
import "./StreakCard.css";
import { Flame } from "lucide-react";
import statsService from "../../services/statsService";

export default function StreakCard() {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await statsService.getUserStats(maNguoiDung);
          if (response.data) {
            setStreak(response.data.chuoiNgayHoc || 0);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải streak:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStreak();
  }, []);

  if (loading) return <div className="loading-streak">...</div>;

  return (
    <div className="streak-card reward-card-base">
      <div className="streak-header">
        <div className="streak-icon-box">
          <Flame size={32} color="white" />
        </div>
        <div className="streak-title-info">
          <span className="streak-label">Chuỗi Hiện Tại</span>
          <h2 className="streak-count">{streak} Ngày</h2>
        </div>
      </div>

      <div className="streak-message-box">
        <p className="streak-title-msg">Tiếp tục phát huy!</p>
        <p className="streak-subtitle-msg">
          {streak > 0 
            ? `Bạn đang duy trì phong độ rất tốt! 🔥` 
            : `Bắt đầu học ngay hôm nay để tạo chuỗi nhé!`}
        </p>
      </div>
    </div>
  );
}
