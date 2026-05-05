import React, { useState } from "react";
import "./FlashCard.css";

export default function FlashCard({
  word,
  phonetic,
  type,
  translation,
  definition,
  exampleEn,
  exampleVi,
  image,
  difficulty,
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Helper hàm để lấy thông tin hiển thị của độ khó
  const getDifficultyInfo = (level) => {
    switch (level) {
      case 1:
        return { label: "Dễ", color: "#10b981" }; // Xanh lá
      case 2:
        return { label: "Vừa", color: "#f59e0b" }; // Vàng cam
      case 3:
        return { label: "Khó", color: "#ef4444" }; // Đỏ
      default:
        return { label: "Dễ", color: "#10b981" };
    }
  };

  const diffInfo = getDifficultyInfo(difficulty);

  // Hàm xử lý sự kiện khi nhấn vào thẻ
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  function handleSpeak(text) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterThis = new SpeechSynthesisUtterance(text);
      utterThis.lang = "en-US";
      utterThis.rate = 0.8; // Tốc độ

      window.speechSynthesis.speak(utterThis);
    } else {
      alert("Trình duyệt của bạn không hỗ trợ tính năng phát âm!");
    }
  }

  return (
    <div className="flashcard-container" onClick={handleFlip}>
      <div className={`flashcard-inner ${isFlipped ? "is-flipped" : ""}`}>
        {/* Mặt trước của thẻ */}
        <div className="flashcard-front">
          {/* Nửa trên: Hình ảnh */}
          <div
            className="flashcard-image-section"
            style={{ backgroundImage: `url(${image})` }}
          >
            <div
              className="difficulty-badge"
              style={{
                backgroundColor: diffInfo.color,
                boxShadow: `0 4px 10px ${diffInfo.color}4D`,
              }}
            >
              {diffInfo.label}
            </div>
            <div className="flashcard-hint-pill">👆 Chạm để xem nghĩa</div>
          </div>

          {/* Nửa dưới: Chữ */}
          <div className="flashcard-text-section">
            <h2 className="flashcard-word-main">{word}</h2>
            <div className="flashcard-phonetic-row">
              <span className="phonetic-text">{phonetic}</span>
              <button
                className="speaker-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn sự kiện lật thẻ khi bấm loa
                  handleSpeak(word);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-volume-2"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mặt sau của thẻ */}
        <div className="flashcard-back">
          <div className="flashcard-back-header">
            <span>💡</span>
          </div>
          <div className="flashcard-back-content">
            <div className="info-box box-translation">
              <div className="info-label">
                <span>Tiếng Việt</span>
              </div>
              <h3 className="info-translation-text">{translation}</h3>
            </div>

            <div className="info-box box-definition">
              <div className="info-label">
                <span className="info-icon">💡</span>
                <span>Định nghĩa</span>
              </div>
              <p className="info-text">{definition}</p>
            </div>

            <div className="info-box box-example">
              <div className="info-label">
                <span className="info-icon">📝</span>
                <span>Ví dụ</span>
              </div>
              <p className="info-text example-en-text">"{exampleEn}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
