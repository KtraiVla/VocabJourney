import React, { useState, useEffect } from "react";
import "./ProfileStats.css";
import { BookOpen, Flame, Medal, TrendingUp } from "lucide-react";
import ProfileStatCard from "./ProfileStatCard.jsx";
import statsService from "../../services/statsService";

export default function ProfileStats() {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await statsService.getUserStats(maNguoiDung);
          if (response && response.data) {
            setUserStats(response.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải thống kê hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-stats">Đang tải...</div>;

  const stats = [
    {
      id: 1,
      title: "Từ đã học",
      value: userStats?.tongTuDaHoc || 0,
      icon: BookOpen,
      color: "#0ea5e9",
    },
    { 
      id: 2, 
      title: "Chuỗi ngày", 
      value: userStats?.chuoiNgayHoc || 0, 
      icon: Flame, 
      color: userStats?.chuoiNgayHoc > 0 ? "#f97316" : "#94a3b8" 
    },
    {
      id: 3,
      title: "Huy hiệu đạt được",
      value: userStats?.tongHuyHieu || 0,
      icon: Medal,
      color: "#eab308",
    },
    {
      id: 4,
      title: "Độ chính xác TB",
      value: userStats?.doChinhXacTB ? `${userStats.doChinhXacTB}%` : "0%",
      icon: TrendingUp,
      color: "#22c55e",
    },
  ];

  return (
    <div className="profile-stats-grid">
      {stats.map((stat) => (
        <ProfileStatCard key={stat.id} {...stat}></ProfileStatCard>
      ))}
    </div>
  );
}
