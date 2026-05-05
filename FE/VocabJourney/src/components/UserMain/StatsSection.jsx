import React, { useState, useEffect } from "react";
import "./StatsSection.css";
import StatCard from "./StatCard.jsx";
import { Zap, Award, Flame, Target } from "lucide-react";
import statsService from "../../services/statsService";

export default function StatsSection() {
  const [userStats, setUserStats] = useState(null);

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
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      icon: <Zap size={42} strokeWidth={2.5} />,
      value: userStats?.diemKinhNghiem || "0",
      title: "Tổng Điểm XP",
      subtitle: `${userStats?.diemKinhNghiem % 500} / 500 XP để lên cấp`,
      type: "purple",
      progress: (userStats?.diemKinhNghiem % 500) / 5,
    },
    {
      icon: <Award size={42} strokeWidth={2.5} />,
      value: `Lvl ${userStats?.capDo || 1}`,
      title: "Cấp Độ Hiện Tại",
      badgeText: userStats?.capDo > 10 ? "🏆 Học Viên Ưu Tú" : "🌱 Người Mới Bắt Đầu",
      type: "blue",
    },
    {
      icon: <Flame size={42} strokeWidth={2.5} />,
      value: userStats?.chuoiNgayHoc || "0",
      title: "Chuỗi Ngày 🔥",
      badgeText: userStats?.chuoiNgayHoc > 0 ? "Đang duy trì tốt!" : "Hãy bắt đầu ngay!",
      type: "orange",
    },
    {
      icon: <Target size={42} strokeWidth={2.5} />,
      value: userStats?.tongTuDaHoc || "0",
      title: "Từ Vựng Đã Học",
      subtitle: "Tổng số từ bạn đã thuộc",
      type: "green",
      progress: 100,
    },
  ];

  return (
    <section className="stats-wrapper">
      <div className="container">
        <div className="stats-section">
          <div className="stats-header">
            <h2>🏆 Bảng Tiến Độ Của Bạn</h2>
            <p>Hãy tiếp tục phát huy nhé! 🎉</p>
          </div>

          <div className="stats-grid">
            {stats.map((item, index) => (
              <StatCard
                key={index}
                icon={item.icon}
                value={item.value}
                title={item.title}
                subtitle={item.subtitle}
                badgeText={item.badgeText}
                type={item.type}
                progress={item.progress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
