import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import FlashCard from "../components/TuVung/FlashCard.jsx";
import LearningControls from "../components/TuVung/LearningControls.jsx";
import LearningProgress from "../components/TuVung/LearningProgress.jsx";
import "./HocTuVungPage.css";

const MOCK_VOCABULARY = [
  {
    id: 1,
    word: "Luggage",
    phonetic: "/ˈlʌɡ.ɪdʒ/",
    type: "Danh từ",
    translation: "Hành lý",
    definition: "Túi xách và vali mà bạn mang theo khi đi du lịch",
    exampleEn: "Where can I claim my luggage?",
    exampleVi: "Tôi có thể nhận hành lý ở đâu?",
    image: "https://images.unsplash.com/photo-1551522435-a13afa10f103?q=80&w=2070&auto=format&fit=crop", // Placeholder ảnh vali/sân bay
  },
  {
    id: 2,
    word: "Passport",
    phonetic: "/ˈpæs.pɔːrt/",
    type: "Danh từ",
    translation: "Hộ chiếu",
    definition: "Tài liệu chính thức do chính phủ cấp để đi lại quốc tế",
    exampleEn: "Don't forget to bring your passport.",
    exampleVi: "Đừng quên mang theo hộ chiếu của bạn.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function HocTuVungPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  // Lấy ra từ vựng hiện tại
  const currentWord = MOCK_VOCABULARY[currentIndex];
  const totalWords = MOCK_VOCABULARY.length;

  // Hàm xử lý khi người dùng nhấn nút "Chưa thuộc" hoặc "Đã thuộc"
  const handleNextWord = (status) => {
    if (status === "remembered") {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else if (status === "forgot") {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    if (currentIndex < totalWords - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    navigate("/chudechitiet"); // Hoặc trang chủ đề tùy ý
  };

  // Nếu đã học xong, hiển thị màn hình chúc mừng
  if (isFinished) {
    return (
      <div className="hoc-tu-vung-page">
        <Navbar />
        <div className="finish-container">
          <h2>🎉 Chúc mừng! 🎉</h2>
          <p>Bạn đã hoàn thành bài học từ vựng hôm nay.</p>
          <div className="final-score">
            <span>💚 {score.correct}</span> | <span>❌ {score.incorrect}</span>
          </div>
          <button 
            className="btn-restart"
            onClick={() => {
              setCurrentIndex(0);
              setScore({ correct: 0, incorrect: 0 });
              setIsFinished(false);
            }}
          >
            Học lại từ đầu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hoc-tu-vung-page">
      <Navbar />
      
      {/* Header riêng cho phần học */}
      <div className="learning-top-header">
        <div className="learning-header-content">
          <button className="learning-back-btn" onClick={handleBack}>
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </button>
          
          <h1 className="learning-title">Học Từ Vựng</h1>
          
          <div className="learning-stats">
            <div className="learning-counter">
              {currentIndex + 1}/{totalWords}
            </div>
            <div className="learning-score-badge">
              <span className="score-correct">💚 {score.correct}</span>
              <span className="score-divider">|</span>
              <span className="score-incorrect">❌ {score.incorrect}</span>
            </div>
          </div>
        </div>
        
        {/* Component hiển thị tiến độ (đường kẻ ngang mỏng) */}
        <LearningProgress 
          currentIndex={currentIndex + 1} 
          totalWords={totalWords} 
        />
      </div>

      <main className="learning-main-container">
        {/* Component hiển thị thẻ Flashcard */}
        <FlashCard 
          key={currentWord.id} 
          word={currentWord.word}
          phonetic={currentWord.phonetic}
          type={currentWord.type}
          translation={currentWord.translation}
          definition={currentWord.definition}
          exampleEn={currentWord.exampleEn}
          exampleVi={currentWord.exampleVi}
          image={currentWord.image}
        />

        {/* Component hiển thị các nút điều khiển */}
        <LearningControls onNext={handleNextWord} />
      </main>
    </div>
  );
}
