import React from "react";
import { ArrowRight, Trophy, Sparkles } from "lucide-react";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <div className="container hero-container">
        {/* bên trái */}
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} className="badge-icon" />
            <span>Học thông minh hơn, không cần học vất vả hơn</span>
          </div>

          <h1 className="hero-title">
            Làm Chủ Từ Vựng <br />
            <span className="hero-highlight">Một Cách Vui Vẻ</span>
          </h1>

          <p className="hero-subtitle">
            Biến đổi trải nghiệm học từ vựng của bạn với trò chơi hóa, lặp lại
            có khoảng cách và nội dung trực quan hấp dẫn. Tham gia cùng hàng
            ngàn học viên trên hành trình thành thạo tiếng Anh.
          </p>

          <div className="hero-actions">
            <button className="btn-primary-large">
              Bắt đầu học <ArrowRight size={20} />
            </button>
            <button className="btn-secondary-large">Xem thử</button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <Trophy size={24} className="stat-icon" />
              </div>
              <div className="stat-info">
                <strong>10,000+</strong>
                <span>Hơn 10.000 học viên</span>
              </div>
            </div>
          </div>
        </div>

        {/* bên phải */}
        <div className="hero-graphic">
          {/* Decorative shapes behind image */}
          <div className="graphic-circle outer-circle"></div>
          <div className="graphic-circle inner-circle"></div>

          {/* Floating cards for visual flair */}
          <div className="floating-card card-1">
            <span className="card-emoji">🚀</span>
            <div className="card-text">
              <div className="line line-1"></div>
              <div className="line line-2"></div>
            </div>
          </div>

          <div className="floating-card card-2">
            <span className="card-emoji">🧠</span>
            <div className="card-text">
              <div className="line line-1"></div>
              <div className="line line-2"></div>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Students learning together"
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
