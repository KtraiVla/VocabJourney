import React from "react";
import { Brain } from "lucide-react";
import "./HowItWord.css";
import step1 from "../assets/images/step_1.png"; 
import step2 from "../assets/images/step_2.png"; 
import step3 from "../assets/images/step_3.png"; 

function HowItWord() {
  return (
    <section className="how-it-word">
      <div className="container">
        <div className="how-it-word-header">
          <h2 className="how-it-word-title">Cách Thức Hoạt Động</h2>
          <p className="how-it-word-desc">
            Bắt đầu hành trình từ vựng của bạn chỉ với ba bước đơn giản
          </p>
        </div>
        <div className="how-it-word-list">
          {/* item 1 */}
          <div className="how-it-word-item">
            <div className="how-it-word-step step-1">1</div>
            <h3 className="how-it-word-item-title">Chọn chủ đề </h3>
            <p className="how-it-word-item-desc">
              Chọn từ hàng chục chủ đề thú vị như Du lịch, Kinh doanh, Ẩm thực
              và nhiều hơn nữa để bắt đầu học từ vựng liên quan.
            </p>
            <img
              src= {step1}
              alt=""
              className="how-it-word-image"
            />
          </div>
          {/* item 2 */}
          <div className="how-it-word-item">
            <div className="how-it-word-step step-2">2</div>
            <h3 className="how-it-word-item-title">Học & Thực Hành</h3>
            <p className="how-it-word-item-desc">
              Học với flashcard, xem hình ảnh, nghe phát âm và thực hành với các
              bài kiểm tra tương tác.
            </p>
            <img
              src= {step2}
              alt=""
              className="how-it-word-image"
            />
          </div>
          {/* item 3 */}
          <div className="how-it-word-item">
            <div className="how-it-word-step step-3">3</div>
            <h3 className="how-it-word-item-title">Theo Dõi Tiến Độ</h3>
            <p className="how-it-word-item-desc">
              Giám sát hành trình học tập của bạn với phân tích chi tiết, đạt
              được thành tích và duy trì chuỗi ngày học hàng ngày.
            </p>
            <img
              src={step3}
              alt=""
              className="how-it-word-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWord;
