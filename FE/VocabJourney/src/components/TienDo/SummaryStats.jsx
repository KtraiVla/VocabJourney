import React, { useState, useEffect } from "react";
import { BookOpen, Target, Award, Calendar } from "lucide-react";
import SummaryCard from "./SummaryCard.jsx";
import "./SummaryStats.css";
import statsService from "../../services/statsService";

export default function SummaryStats() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await statsService.getUserStats(maNguoiDung);
          if (response && response.data) {
            setStatsData(response.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải thống kê tổng quát:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-stats">Đang tải thống kê...</div>;

  const stats = [
    {
      value: statsData?.tongTuDaHoc || 0,
      label: "Tổng Từ Đã Học",
      icon: <BookOpen />,
      background: "linear-gradient(135deg, #06b6d4, #0891b2)",
    },
    {
      value: statsData?.tongBaiHocDaXong || 0,
      label: "Bài Học Hoàn Thành",
      icon: <Target />,
      background: "linear-gradient(135deg, #a855f7, #9333ea)",
    },
    {
      value: statsData?.doChinhXacTB ? `${statsData.doChinhXacTB}%` : "0%",
      label: "Độ Chính Xác Trung Bình",
      icon: <Award />,
      background: "linear-gradient(135deg, #22c55e, #16a34a)",
    },
    {
      value: statsData?.chuoiNgayHoc || 0,
      label: "Chuỗi Ngày Học",
      icon: <Calendar />,
      background: statsData?.chuoiNgayHoc > 0 
        ? "linear-gradient(135deg, #f97316, #ea580c)" 
        : "linear-gradient(135deg, #94a3b8, #64748b)",
    },
  ];

  return (
    <div className="summary-stats-grid">
      {stats.map((stat, index) => (
        <SummaryCard
          key={index}
          value={stat.value}
          label={stat.label}
          icon={stat.icon}
          background={stat.background}
        />
      ))}
    </div>
  );
}
