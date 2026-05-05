import React, { useState, useEffect } from "react";
import { Zap, User, Flame, Target, Trophy } from "lucide-react";
import "./StatsSection.css";
import StatCard from "./StatCard";
import statsService from "../../services/statsService";

export default function StatsSection() {
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
        console.error("Lỗi khi lấy thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="stats-loading">Đang tải thống kê...</div>;

  const tuVungHomNay = (userStats?.soTuHocHomNay || 0) + (userStats?.soTuOnHomNay || 0);

  return (
    <div className="container">
      <div className="stats-section-wrapper">
        <div className="stats-main-header">
          <div className="header-title-row">
            <Trophy className="trophy-icon" size={32} />
            <h2>Bảng Tiến Độ Của Bạn</h2>
          </div>
          <p>Hãy tiếp tục phát huy nhé! 🎉</p>
        </div>

        <div className="stats-grid">
          <StatCard
            icon={<Zap size={28} fill="currentColor" />}
            value={userStats?.diemKinhNghiem || 0}
            title="Tổng Điểm XP"
            subtitle={`${userStats?.diemKinhNghiem || 0} / ${userStats?.xpTarget || 200} XP để đạt cấp ${ (userStats?.capDo || 1) + 1 }`}
            progress={userStats?.xpProgress || 0}
            type="purple"
          />

          <StatCard
            icon={<User size={28} />}
            value={`Lvl ${userStats?.capDo || 1}`}
            title="Cấp Độ Hiện Tại"
            badgeText="🏆 Học Viên Nâng Cao"
            type="blue"
          />

          <StatCard
            icon={<Flame size={28} fill="currentColor" />}
            value={userStats?.chuoiNgayHoc || 0}
            title="Chuỗi Ngày 🔥"
            badgeText="Hãy duy trì!"
            type="orange"
          />

          <StatCard
            icon={<Target size={28} />}
            value={`${Math.min(100, Math.round((tuVungHomNay / 20) * 100))}%`}
            title="Mục Tiêu Hàng Ngày"
            subtitle={`${tuVungHomNay} / 20 từ vựng hôm nay`}
            progress={Math.min(100, (tuVungHomNay / 20) * 100)}
            type="green"
          />
        </div>
      </div>
    </div>
  );
}
