import { Target, Trophy } from "lucide-react";
import "./QuizBanner.css";

export default function QuizBanner() {
  return (
    <div className="quiz-banner-container">
      <div className="quiz-banner-content">
        <div className="quiz-icon-wrapper">
          <Target size={40} color="white" strokeWidth={2.5} />
        </div>
        <div className="quiz-text">
          <h3>Sẵn sàng kiểm tra kiến thức?</h3>
          <p>Làm bài kiểm tra để củng cố kiến thức đã học! 🚀</p>
        </div>
      </div>
      <div className="quiz-action">
        <button className="start-quiz-btn">🏆 Bắt đầu kiểm tra</button>
      </div>
    </div>
  );
}
