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
            <span>The #1 Fun Way to Learn English</span>
          </div>

          <h1 className="hero-title">
            Master Vocabulary <br />
            <span className="hero-highlight">With Joy & Ease</span>
          </h1>

          <p className="hero-subtitle">
            Embark on an interactive journey to build your english vocabulary,
            track your progress, and master the language naturally through
            gamified learning and spaced repetition.
          </p>

          <div className="hero-actions">
            <button className="btn-primary-large">
              Start Your Journey <ArrowRight size={20} />
            </button>
            <button className="btn-secondary-large">View Courses</button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <Trophy size={24} className="stat-icon" />
              </div>
              <div className="stat-info">
                <strong>10,000+</strong>
                <span>Active Learners</span>
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
