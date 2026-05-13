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

  // 3. Màn hình hoàn thành ôn tập Premium
  if (isFinished) {
    const isPerfect = score.incorrect === 0;
    const isGood = score.correct > score.incorrect;

    return (
      <div className="hoc-tu-vung-page">
        <Navbar />
        <div className="finish-screen-premium">
          <div className="finish-deco deco-1"></div>
          <div className="finish-deco deco-2"></div>
          
          <div className="finish-card">
            <div className="finish-icon-wrapper">
              {isPerfect ? "🏆" : isGood ? "🌟" : "💪"}
            </div>
            
            <h2 className="finish-title">
              {isPerfect ? "Thật ấn tượng!" : isGood ? "Rất xuất sắc!" : "Tiếp tục cố gắng!"}
            </h2>
            <p className="finish-subtitle">
              {isPerfect 
                ? "Bạn đã ôn tập xong tất cả các từ mà không sai câu nào!" 
                : "Bạn đã hoàn thành phiên ôn tập ngày hôm nay. Trí nhớ của bạn đang tốt dần lên đấy!"}
            </p>

            <div className="finish-stats-grid">
              <div className="stat-box correct">
                <span className="stat-label">Đã nhớ</span>
                <span className="stat-value">{score.correct}</span>
              </div>
              <div className="stat-box incorrect">
                <span className="stat-label">Cần xem lại</span>
                <span className="stat-value">{score.incorrect}</span>
              </div>
            </div>

            <div className="finish-actions">
              <button 
                className="btn-primary-finish"
                onClick={() => navigate("/homeuser")}
              >
                Quay về trang chủ
              </button>
              <button 
                className="btn-secondary-finish"
                onClick={() => {
                  setCurrentIndex(0);
                  setScore({ correct: 0, incorrect: 0 });
                  setIsFinished(false);
                }}
              >
                Ôn tập lại lượt này
              </button>
            </div>
          </div>
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
