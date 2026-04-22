import React from "react";
import { Brain, Trophy, Target, BookOpen } from "lucide-react";
import "./FeaturesSection.css";

function FeaturesSection() {
  const features = [
    {
      icon: <BookOpen size={32} />,
      title: "Nội Dung Hình Ảnh Phong Phú",
      description: "Mỗi từ đều đi kèm với hình ảnh đẹp mắt, phát âm rõ ràng và ví dụ thực tế để nâng cao khả năng ghi nhớ.",
      color: "cyan"
    },
    {
      icon: <Brain size={32} />,
      title: "Lặp Lại Có Khoảng Cách",
      description: "Thuật toán thông minh của chúng tôi hiển thị từ vào thời điểm hoàn hảo để tối đa hóa khả năng ghi nhớ và giảm thiểu quên lãng.",
      color: "purple"
    },
    {
      icon: <Trophy size={32} />,
      title: "Trò Chơi Hóa",
      description: "Kiếm XP, nâng cấp, duy trì chuỗi ngày học và mở khóa huy hiệu khi bạn tiến bộ trong hành trình từ vựng của mình.",
      color: "orange"
    },
    {
      icon: <Target size={32} />,
      title: "Bài Kiểm Tra Tương Tác",
      description: "Kiểm tra kiến thức của bạn với các bài quiz hấp dẫn có nhiều loại câu hỏi và phản hồi tức thì.",
      color: "green"
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
