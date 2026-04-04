import React from "react";
import { Brain, Gamepad2, TrendingUp, Clock } from "lucide-react";
import "./FeaturesSection.css";

function FeaturesSection() {
  const features = [
    {
      icon: <Brain size={32} />,
      title: "Spaced Repetition",
      description: "Our smart algorithm schedules reviews at the optimal time to ensure long-term retention.",
      color: "blue"
    },
    {
      icon: <Gamepad2 size={32} />,
      title: "Gamified Learning",
      description: "Earn points, complete quests, and compete on the leaderboard to stay motivated.",
      color: "purple"
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Progress Tracking",
      description: "Visualize your vocabulary growth with detailed statistics and daily insights.",
      color: "green"
    },
    {
      icon: <Clock size={32} />,
      title: "Bite-sized Lessons",
      description: "Learn effectively in just 10 minutes a day, fitting perfectly into your busy schedule.",
      color: "orange"
    }
  ];

  return (
    <section className="feature-section" id="features">
      <div className="container container-feature">
        {/* Phần trên - header */}
        <div className="feature-header">
          <span className="section-subtitle">Core Features</span>
          <h2 className="feature-heading">Why Choose VocabJourney?</h2>
          <div className="feature-desc">
            Experience a revolutionary approach to vocabulary learning with
            our unique combination of proven techniques and modern technology.
          </div>
        </div>

        {/* Phần dưới - danh sách tính năng */}
        <div className="feature-body">
          <div className="feature-grid">
            {features.map((feature, index) => (
              <div className="feature-item" key={index}>
                <div className={`feature-icon-wrapper color-${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-item-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
