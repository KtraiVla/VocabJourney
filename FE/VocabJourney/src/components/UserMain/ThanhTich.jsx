import React, { useState, useEffect } from "react";
import "./ThanhTich.css";
import { Trophy } from "lucide-react";
import badgeService from "../../services/badgeService";

export default function ThanhTich() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await badgeService.getUserBadges(maNguoiDung);
          if (response.data && response.data.success) {
            setBadges(response.data.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thành tích:", error);
      }
    };
    fetchBadges();
  }, []);

  return (
    <div className="achievements-block">
      <div className="achievements-header">
        <div className="header-left">
          <div className="achievements-header-icon">
            <Trophy size={24} color="white" />
          </div>
          <h3>Thành Tích</h3>
        </div>
        <a href="/phanthuong" className="db-view-all">
          Xem Tất Cả
        </a>
      </div>
      
      <div className="achievements-grid">
        {badges.length > 0 ? (
          badges.slice(0, 3).map((badge, i) => (
            <div key={i} className="achievement-item" title={badge.moTa}>
              <div className="achievement-icon-wrap">
                <span className="achievement-icon">{badge.iconName || "🏅"}</span>
              </div>
              <p className="achievement-label">{badge.tenHuyHieu}</p>
            </div>
          ))
        ) : (
          <p style={{ fontSize: "0.9rem", color: "#64748b", gridColumn: "span 3", textAlign: "center", padding: "10px 0" }}>
            Chưa có thành tích nào. Hãy tích cực học nhé!
          </p>
        )}
      </div>
    </div>
  );
}
