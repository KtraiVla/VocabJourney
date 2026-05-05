import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import FlashCard from "../components/TuVung/FlashCard.jsx";
import LearningControls from "../components/TuVung/LearningControls.jsx";
import LearningProgress from "../components/TuVung/LearningProgress.jsx";
import vocabService from "../services/vocabService.js";
import progressService from "../services/progressService.js";
import "./HocTuVungPage.css";

export default function HocTuVungPage() {
  const navigate = useNavigate();
  // Lấy ID bài học từ URL (do bạn đã sửa trong App.jsx thành /hoctuvung/:lessonId)
  const { lessonId } = useParams();

  // State quản lý việc học
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  // State quản lý dữ liệu API
  const [vocabularyList, setVocabularyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gọi API khi component vừa load hoặc khi lessonId thay đổi
  useEffect(() => {
    const fetchVocab = async () => {
      try {
        setIsLoading(true);
        const response = await vocabService.getTuVungByBaiHoc(lessonId);
        const ketQua = response.data;

        // Cập nhật danh sách từ vựng vào state
        if (ketQua && ketQua.success) {
          setVocabularyList(ketQua.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy từ vựng: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonId) {
      fetchVocab();
    }
  }, [lessonId]);

  // Hàm xử lý khi người dùng nhấn nút "Chưa thuộc" hoặc "Đã thuộc"
  const handleNextWord = async (status) => {
    const currentWord = vocabularyList[currentIndex];
    const maNguoiDung = localStorage.getItem("maNguoiDung");
    
    // 1. Lưu tiến độ từng từ vựng vào Database
    try {
      if (maNguoiDung) {
        await progressService.saveVocabProgress(maNguoiDung, currentWord.maTuVung, status === "remembered");
      }
    } catch (error) {
      console.error("Lỗi khi lưu tiến độ từ vựng:", error);
    }

    if (status === "remembered") {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else if (status === "forgot") {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    if (currentIndex < vocabularyList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
      // 2. Khi hoàn thành cả bài, lưu tiến độ bài học
      try {
        if (maNguoiDung) {
          await progressService.saveLessonProgress(maNguoiDung, lessonId);
        }
      } catch (error) {
        console.error("Lỗi khi lưu tiến độ bài học:", error);
      }
    }
  };

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  // --- CÁC MÀN HÌNH HIỂN THỊ ---

  // 1. Màn hình loading khi đang gọi API
  if (isLoading) {
    return (
      <div className="hoc-tu-vung-page">
        <Navbar />
        <div
          style={{
            textAlign: "center",
            marginTop: "100px",
            fontSize: "1.2rem",
          }}
        >
          Đang tải từ vựng...
        </div>
      </div>
    );
  }

  // 2. Màn hình trống (khi bài học chưa có từ vựng nào)
  if (vocabularyList.length === 0) {
    return (
      <div className="hoc-tu-vung-page">
        <Navbar />
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h2>Bài học này chưa có từ vựng!</h2>
          <button
            onClick={handleBack}
            style={{ marginTop: "20px", padding: "10px 20px" }}
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // 3. Màn hình hoàn thành bài học
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
          <button
            onClick={handleBack}
            style={{
              marginLeft: "10px",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            Quay về danh sách
          </button>
        </div>
      </div>
    );
  }

  // 4. Màn hình đang học (Hiển thị Flashcard)
  const currentWord = vocabularyList[currentIndex];
  const totalWords = vocabularyList.length;

  return (
    <div className="hoc-tu-vung-page">
      <Navbar />

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

        <LearningProgress
          currentIndex={currentIndex + 1}
          totalWords={totalWords}
        />
      </div>

      <main className="learning-main-container">
        {/* Truyen cac props vao FlashCard.
            Lưu ý: Bạn có thể cần điều chỉnh tên biến (ví dụ: currentWord.tuVungTiengAnh)
            sao cho khớp chính xác với dữ liệu API BE trả về nhé!
        */}
        <FlashCard
          key={currentWord.maTuVung || currentIndex}
          word={currentWord.tuTiengAnh}
          phonetic={currentWord.phienAm}
          type={""} // Backend hiện chưa có trường Từ Loại (Danh từ, Động từ...)
          translation={currentWord.nghiaTiengViet}
          definition={currentWord.dinhNghia || "Đang cập nhật định nghĩa..."}
          exampleEn={currentWord.viDu || "Đang cập nhật ví dụ..."}
          exampleVi={""} // Backend hiện chưa có trường Ví dụ Tiếng Việt
          image={currentWord.anhMinhHoa}
          difficulty={currentWord.doKho}
        />

        <LearningControls onNext={handleNextWord} />
      </main>
    </div>
  );
}
