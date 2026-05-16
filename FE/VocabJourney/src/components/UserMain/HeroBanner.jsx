import "./HeroBanner.css";
import { Zap, ArrowRight } from "lucide-react";
import herobg from "../../assets/images/herobg.jpg";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const navigate = useNavigate();
  return (
    <div className="dashboard-hero">
      <div className="container">
        <div className="dashboard-hero-body">
          <div className="db-hero-content">
            <div className="db-hero-badge">
              <span>✨ Chào mừng trở lại, Nguyễn!</span>
            </div>

            <h1 className="db-hero-title">
              Học Từ Vựng
              <br />
              Tiếng Anh Theo
              <br />
              Cách Thú Vị
            </h1>

            <p className="db-hero-desc">
              Nâng cao vốn từ vựng với phương pháp học thông minh và luyện tập
              mỗi ngày 🚀
            </p>

            <div className="db-hero-btns">
              <button className="db-btn-primary" onClick={() => navigate("/chude")}>
                <Zap size={18} fill="currentColor" />
                <span>Bắt Đầu Học</span>
              </button>
              <button className="db-btn-secondary" onClick={() => navigate("/chude")}>
                <span>Tiếp Tục Học</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="db-hero-image-section">
            <div className="db-hero-image-wrapper">
              <img
                src={herobg}
                alt="Cultural Learning"
                className="db-hero-img"
              />
              <div className="db-hero-owl-badge">
                <div className="owl-icon">🦉</div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="db-hero-deco deco-1"></div>
          <div className="db-hero-deco deco-2"></div>
        </div>
      </div>
    </div>
  );
}
