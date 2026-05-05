import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import "./ReviewCard.css";
import progressService from "../../services/progressService";

export default function ReviewCard() {
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await progressService.getReviewCount(maNguoiDung);
          if (response.data && response.data.success) {
            setReviewCount(response.data.count);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy số lượng ôn tập:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewCount();
  }, []);

  return (
    <div className="review-card">
      <div className="review-content-wrapper">
        <div className="review-top-part">
          <div className="review-icon-circle">
            <Clock size={32} strokeWidth={2.5} />
          </div>
          <div className="review-text-info">
            <h3>Giờ Ôn Tập!</h3>
            <p>Đừng để từ vựng bị lãng quên</p>
          </div>
        </div>

        <div className="review-count-badge">
          <strong>{loading ? "..." : reviewCount} từ vựng</strong>
          <span>cần ôn tập hôm nay</span>
        </div>
      </div>

      <button className="review-action-btn">
        Bắt Đầu Ôn Tập <span className="rocket-emoji">🚀</span>
      </button>

      <div className="review-deco deco-top-right"></div>
      <div className="review-deco deco-bottom-left"></div>
    </div>
  );
}
