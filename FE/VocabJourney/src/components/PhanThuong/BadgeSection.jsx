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
          const response = await badgeService.getUserBadges(maNguoiDung);
          if (response.data && response.data.success) {
            const formattedBadges = response.data.data.map(item => ({
              id: item.maHuyHieu,
              name: item.tenHuyHieu,
              description: item.moTa,
              icon: item.iconName || "🏅", // Sử dụng IconName từ DB hoặc icon mặc định
              unlocked: true,
              date: null // Tạm thời để null nếu DB chưa lưu ngày đạt được
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
        <span className="badge-count">{badges.length} đã đạt</span>
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
