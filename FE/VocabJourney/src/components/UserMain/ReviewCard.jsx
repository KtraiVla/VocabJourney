import React, { useState, useEffect } from "react";
import "./ReviewCard.css";
import { Clock } from "lucide-react";
import progressService from "../../services/progressService";

export default function ReviewCard() {
  const [reviewCount, setReviewCount] = useState(0);

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
        console.error("Lỗi khi lấy số từ cần ôn tập:", error);
      }
    };
    fetchReviewCount();
  }, []);

  return (
    <div className="review-card">
      <div className="review-content-wrapper">
        <div className="review-top-part">
          <div className="review-icon-circle">
            <Clock size={24} color="white" />
          </div>
          <div className="review-text-info">
            <h3>Giờ Ôn Tập!</h3>
            <p>Đừng để từ vựng bị lãng quên</p>
          </div>
        </div>

        <div className="review-count-badge">
          <strong>{reviewCount} từ vựng</strong>
          <span>cần ôn tập hôm nay</span>
        </div>
      </div>

      <button 
        className="review-action-btn"
        disabled={reviewCount === 0}
      >
        {reviewCount > 0 ? "Bắt Đầu Ôn Tập" : "Đã Hoàn Thành!"} <span className="rocket-emoji">🚀</span>
      </button>
      
      {/* Decorative circles */}
      <div className="review-deco deco-top-right"></div>
      <div className="review-deco deco-bottom-left"></div>
    </div>
  );
}
