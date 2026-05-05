import React, { useState, useEffect } from "react";
import bgDefault from "../../assets/images/dulich.jpg";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ContinueCard.css";
import progressService from "../../services/progressService";

export default function ContinueCard() {
  const [recentLesson, setRecentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await progressService.getRecentLesson(maNguoiDung);
          if (response.data && response.data.success) {
            setRecentLesson(response.data.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài học gần nhất:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) return <div className="continue-card loading-state">Đang tải...</div>;

  if (!recentLesson) {
    return (
      <div className="continue-card empty-state">
        <div className="continue-content">
          <h3>Bắt đầu học ngay!</h3>
          <p>Bạn chưa học bài nào. Hãy chọn một chủ đề để khám phá nhé.</p>
          <button className="continue-btn" onClick={() => navigate("/chude")}>
            Khám phá <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="continue-card">
      <div className="continue-image-box">
        <span className="continue-tag">Đang Học</span>
        <img
          src={recentLesson.anhMinhHoa || bgDefault}
          alt={recentLesson.tieuDe}
          className="continue-image"
        />
      </div>

      <div className="continue-content">
        <div className="continue-top">
          <div>
            <h3>Tiếp Tục Học</h3>
            <p>{recentLesson.tenChuDe} - {recentLesson.tieuDe}</p>
          </div>
          <div className="continue-percent">
            <strong>{recentLesson.tienDo}%</strong>
            <span>Hoàn Thành</span>
          </div>
        </div>

        <div className="continue-progress">
          <div className="continue-progress-bar" style={{ width: `${recentLesson.tienDo}%` }}></div>
        </div>

        <div className="continue-bottom">
          <div className="continue-info-list">
            <div className="continue-info-pill pill-purple">📍 {recentLesson.tenChuDe}</div>
            <div className="continue-info-pill pill-blue">📖 Bài học hiện tại</div>
          </div>

          <button 
            className="continue-btn"
            onClick={() => navigate(`/hoctuvung/${recentLesson.maBaiHoc}`)}
          >
            Tiếp Tục <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
