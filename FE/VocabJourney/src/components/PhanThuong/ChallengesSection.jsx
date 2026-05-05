import React, { useState, useEffect } from "react";
import "./ChallengesSection.css";
import { Zap } from "lucide-react";
import ChallengeProgressItem from "./ChallengeProgressItem.jsx";
import statsService from "../../services/statsService";

export default function ChallengesSection() {
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
        console.error("Lỗi khi tải nhiệm vụ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-challenges">...</div>;

  const challenges = [
    {
      id: 1,
      type: "Hàng Ngày",
      typeColor: "#3b82f6",
      typeBg: "#eff6ff",
      xp: 20,
      title: "Nhà Thông Thái Trẻ",
      description: "Học 5 từ mới trong ngày",
      current: stats?.soTuHocHomNay || 0,
      total: 5,
    },
    {
      id: 2,
      type: "Hàng Ngày",
      typeColor: "#a855f7",
      typeBg: "#f5f3ff",
      xp: 30,
      title: "Chăm Chỉ Mỗi Ngày",
      description: "Ôn tập 10 từ vựng",
      current: stats?.soTuOnHomNay || 0,
      total: 10,
    },
    {
      id: 3,
      type: "Hàng Ngày",
      typeColor: "#10b981",
      typeBg: "#f0fdf4",
      xp: 40,
      title: "Chiến Binh Quiz",
      description: "Hoàn thành 1 bài kiểm tra",
      current: stats?.soQuizHomNay || 0,
      total: 1,
    }
  ];

  return (
    <section className="challenges-section reward-card-base">
      <div className="section-header">
        <div className="section-title">
          <Zap size={20} color="#f97316" />
          <h3>Nhiệm Vụ Hàng Ngày</h3>
        </div>
      </div>

      <div className="challenges-list">
        {challenges.map((challenge) => (
          <ChallengeProgressItem key={challenge.id} {...challenge} />
        ))}
      </div>
    </section>
  );
}
