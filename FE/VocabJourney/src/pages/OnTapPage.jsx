import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import FlashCard from "../components/TuVung/FlashCard.jsx";
import LearningControls from "../components/TuVung/LearningControls.jsx";
import LearningProgress from "../components/TuVung/LearningProgress.jsx";
import progressService from "../services/progressService.js";
import "./HocTuVungPage.css"; // Dùng chung style với trang học

export default function OnTapPage() {
  const navigate = useNavigate();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [vocabularyList, setVocabularyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOnTapVocab = async () => {
      try {
        setIsLoading(true);
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await progressService.getDanhSachOnTap(maNguoiDung);
          if (response.data && response.data.success) {
            setVocabularyList(response.data.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ôn tập: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOnTapVocab();
  }, []);

  const handleNextWord = async (status) => {
    const currentWord = vocabularyList[currentIndex];
    const maNguoiDung = localStorage.getItem("maNguoiDung");
    
    try {
      if (maNguoiDung) {
        // Gọi API lưu tiến độ ôn tập (thuật toán SRS sẽ xử lý ở Backend)
        await progressService.saveVocabProgress(maNguoiDung, currentWord.maTuVung, status === "remembered");
      }
    } catch (error) {
      console.error("Lỗi khi lưu tiến độ ôn tập:", error);
    }

    if (status === "remembered") {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    if (currentIndex < vocabularyList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    navigate("/homeuser");
  };

  if (isLoading) {
    return (
      <div className="hoc-tu-vung-page">
        <Navbar />
        <div className="loading-container" style={{ textAlign: "center", marginTop: "100px" }}>
          <h2>Đang chuẩn bị danh sách ôn tập...</h2>
        </div>
      </div>
    );
  }

  if (vocabularyList.length === 0) {
    return (
      <div className="hoc-tu-vung-page">
        <Navbar />
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h2>Tuyệt vời! Bạn không còn từ nào cần ôn tập hôm nay.</h2>
          <button onClick={handleBack} className="btn-back-home" style={{ marginTop: "20px", padding: "12px 24px", borderRadius: "8px", background: "#3b82f6", color: "white", border: "none", cursor: "pointer" }}>
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="hoc-tu-vung-page">
        <Navbar />
        <div className="finish-container">
          <h2>🎉 Hoàn thành ôn tập! 🎉</h2>
          <p>Bạn đã ôn tập xong các từ vựng đến hạn hôm nay.</p>
          <div className="final-score">
            <span>💚 Thuộc: {score.correct}</span> | <span>❌ Quên: {score.incorrect}</span>
          </div>
          <button className="btn-restart" onClick={() => navigate("/homeuser")}>
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const currentWord = vocabularyList[currentIndex];
  const totalWords = vocabularyList.length;

  return (
    <div className="hoc-tu-vung-page">
      <Navbar />

      <div className="learning-top-header">
        <div className="learning-header-content">
          <button className="learning-back-btn" onClick={handleBack}>
            <ArrowLeft size={18} />
            <span>Thoát ôn tập</span>
          </button>

          <h1 className="learning-title">Ôn Tập Từ Vựng</h1>

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

        <LearningProgress currentIndex={currentIndex + 1} totalWords={totalWords} />
      </div>

      <main className="learning-main-container">
        <FlashCard
          key={currentWord.maTuVung || currentIndex}
          word={currentWord.tuTiengAnh}
          phonetic={currentWord.phienAm}
          translation={currentWord.nghiaTiengViet}
          definition={currentWord.dinhNghia || "Đang cập nhật định nghĩa..."}
          exampleEn={currentWord.viDu || "Đang cập nhật ví dụ..."}
          image={currentWord.anhMinhHoa}
          difficulty={currentWord.doKho}
        />

        <LearningControls onNext={handleNextWord} />
      </main>
    </div>
  );
}
