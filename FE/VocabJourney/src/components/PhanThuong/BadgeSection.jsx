import React, { useState, useEffect } from "react";
import BadgeCard from "./BadgeCard.jsx";
import { Award } from "lucide-react";
import "./BadgeSection.css";
import badgeService from "../../services/badgeService";

export default function BadgeSection() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          // Sử dụng API lấy toàn bộ huy hiệu kèm trạng thái
          const response = await badgeService.getAllBadgesWithStatus(maNguoiDung);
          if (response.data && response.data.success) {
            const formattedBadges = response.data.data.map(item => ({
              id: item.maHuyHieu,
              name: item.tenHuyHieu,
              description: item.moTa,
              requirement: item.dieuKien,
              icon: item.iconName || "🏅",
              unlocked: item.daDatDuoc,
              currentProgress: item.currentProgress,
              targetProgress: item.targetProgress,
              percentage: item.percentage,
              date: null
            }));
            setBadges(formattedBadges);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải huy hiệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  if (loading) return <div className="loading-badges">Đang tải huy hiệu...</div>;

  return (
    <section className="badges-section reward-card-base">
      <div className="section-header">
        <div className="section-title">
          <Award size={20} color="#f59e0b" />
          <h3>Huy Hiệu & Thành Tích</h3>
        </div>
        <span className="badge-count">
          {badges.filter(b => b.unlocked).length} đã đạt
        </span>
      </div>

      <div className="badges-grid">
        {badges.length > 0 ? (
          badges.map((badge) => (
            <BadgeCard key={badge.id} {...badge} />
          ))
        ) : (
          <p className="no-badges">Bạn chưa đạt được huy hiệu nào. Hãy cố gắng lên!</p>
        )}
      </div>
    </section>
  );
}
