import React, { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import "./RankCard.css";
import statsService from "../../services/statsService";

export default function RankCard() {
  const [rank, setRank] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRank = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await statsService.getUserStats(maNguoiDung);
          if (response && response.data) {
            // Kiểm tra cả hai trường hợp hoa/thường để chắc chắn nhận được dữ liệu
            const rankValue = response.data.thuHang || response.data.ThuHang;
            if (rankValue) {
              setRank(rankValue);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thứ hạng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRank();
  }, []);

  if (loading) return <div className="loading-card">...</div>;

  return (
    <div className="weekly-rank-card reward-card-base">
      <div className="rank-header">
        <Trophy size={18} color="#f59e0b" />
        <h3>Xếp Hạng Của Bạn</h3>
      </div>

      <div className="rank-display-container">
        <div className="rank-circle">
          <span className="rank-number">#{rank}</span>
        </div>
        <p className="rank-subtitle">Thứ Hạng Toàn Cầu Của Bạn</p>
      </div>

      <div className="rank-footer">
        <div className="rank-pill">
          {rank <= 10 
            ? `Tuyệt vời! Bạn đang nằm trong Top 10 cao thủ! 🏆` 
            : `Hãy tích lũy thêm XP để thăng hạng nhé! 🚀`}
        </div>
      </div>
    </div>
  );
}
