import bgDuLich from "../../assets/images/dulich.jpg";
import { ArrowRight } from "lucide-react";
import "./ContinueCard.css";



export default function ContinueCard() {
  return (
    <div className="continue-card">
      <div className="continue-image-box">
        <span className="continue-tag">Đang Học</span>
        <img
          src={bgDuLich}
          alt="Continue learning"
          className="continue-image"
        />
      </div>

      <div className="continue-content">
        <div className="continue-top">
          <div>
            <h3>Tiếp Tục Học</h3>
            <p>Du Lịch &amp; Khách Sạn</p>
          </div>
          <div className="continue-percent">
            <strong>75%</strong>
            <span>Hoàn Thành</span>
          </div>
        </div>

        <div className="continue-progress">
          <div className="continue-progress-bar" style={{ width: "75%" }}></div>
        </div>

        <div className="continue-bottom">
          <div className="continue-info-list">
            <div className="continue-info-pill pill-purple">📚 6/8 bài học</div>
            <div className="continue-info-pill pill-blue">✨ 72/96 từ vựng</div>
          </div>

          <button className="continue-btn">
            Tiếp Tục <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
