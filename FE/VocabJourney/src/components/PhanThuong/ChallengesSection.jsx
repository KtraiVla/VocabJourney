import React, { useState, useEffect } from "react";
import "./ChallengesSection.css";
import { Target } from "lucide-react";
import ChallengeProgressItem from "./ChallengeProgressItem.jsx";
import challengeService from "../../services/challengeService";

export default function ChallengesSection() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await challengeService.getDailyChallenges(maNguoiDung);
          if (response.data && response.data.success) {
            setChallenges(response.data.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải nhiệm vụ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  if (loading) return <div className="loading-challenges" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Đang tải thử thách...</div>;

  return (
    <section className="challenges-section reward-card-base" style={{ padding: "24px" }}>
      <div className="section-header" style={{ marginBottom: "24px" }}>
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ color: "#f97316" }}>
            <Target size={28} />
          </div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            Thử Thách Hàng Ngày
          </h3>
        </div>
      </div>

      <div className="challenges-list">
        {challenges.length > 0 ? (
          challenges.map((item, index) => (
            <ChallengeProgressItem
              key={index}
              title={item.title}
              desc={item.desc}
              reward={item.reward}
              progress={item.progress}
              total={item.total}
              type="Hàng Ngày"
            />
          ))
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "40px 20px", 
            background: "#f8fafc", 
            borderRadius: "16px",
            border: "2px dashed #e2e8f0" 
          }}>
            <p style={{ margin: 0, color: "#64748b", fontWeight: "500" }}>
              Hiện chưa có thử thách nào đang diễn ra.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
