import React, { useState, useEffect } from "react";
import "./ChallengeSection.css";
import ChallengeItem from "./ChallengeItem.jsx";
import { Target } from "lucide-react";
import challengeService from "../../services/challengeService";

export default function ChallengesSection() {
  const [challenges, setChallenges] = useState([]);

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
        console.error("Lỗi khi lấy thử thách:", error);
      }
    };
    fetchChallenges();
  }, []);

  return (
    <section className="challenges-section">
      <div className="challenges-header">
        <div className="challenges-header-icon">
          <Target size={24} color="white" />
        </div>
        <h3>Thử Thách Hàng Ngày</h3>
      </div>

      <div className="challenges-list">
        {challenges.length > 0 ? (
          challenges.map((item, index) => (
            <ChallengeItem
              key={index}
              title={item.title}
              desc={item.desc}
              reward={item.reward}
              progress={item.progress}
              total={item.total}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#64748b", padding: "20px" }}>
            Hiện chưa có thử thách nào hôm nay.
          </p>
        )}
      </div>
    </section>
  );
}
