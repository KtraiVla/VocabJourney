import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Play, Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import FlashCard from "../components/TuVung/FlashCard.jsx";
import LearningControls from "../components/TuVung/LearningControls.jsx";
import LearningProgress from "../components/TuVung/LearningProgress.jsx";
import vocabService from "../services/vocabService.js";
import progressService from "../services/progressService.js";
import baihocService from "../services/baihocService.js";
import "./HocTuVungPage.css";

export default function HocTuVungPage() {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  // State quản lý việc học
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isOverview, setIsOverview] = useState(true);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  // State quản lý dữ liệu API
  const [lessonInfo, setLessonInfo] = useState(null);
  const [originalList, setOriginalList] = useState([]);
  const [learningList, setLearningList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        
        // 1. Lấy thông tin bài học
        const lessonRes = await baihocService.getLessonById(lessonId);
        if (lessonRes.data && lessonRes.data.success) {
          setLessonInfo(lessonRes.data.data);
        }

        // 2. Lấy từ vựng kèm tiến độ
        const response = await vocabService.getTuVungByBaiHocWithProgress(lessonId, maNguoiDung);
        const ketQua = response.data;

        if (ketQua && ketQua.success) {
          setOriginalList(ketQua.data);
          setIsOverview(true);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonId) {
      fetchData();
    }
  }, [lessonId]);

  // Hàm khi nhấn nút "Bắt đầu học" từ màn hình Overview
  const startLearning = () => {
    // Lọc ra những từ CHƯA THUỘC (daHoc === false)
    const unlearnedWords = originalList.filter(item => !item.daHoc);
    
    // Nếu đã thuộc hết rồi, thì cho học lại toàn bộ (Ôn tập)
    if (unlearnedWords.length === 0) {
      setLearningList(originalList);
    } else {
      setLearningList(unlearnedWords);
    }
    
    setCurrentIndex(0);
    setScore({ correct: 0, incorrect: 0 });
    setIsOverview(false);
  };

  const handleNextWord = async (status) => {
    const currentWord = learningList[currentIndex];
    const maNguoiDung = localStorage.getItem("maNguoiDung");
    
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

    if (currentIndex < learningList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
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
  if (originalList.length === 0) {
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

  // 3. Màn hình Tổng quan (Overview) - Liệt kê từ vựng Premium
  if (isOverview) {
    const learnedCount = originalList.filter(item => item.daHoc).length;
    const progressPercent = (learnedCount / originalList.length) * 100;
    const isAllLearned = learnedCount === originalList.length;

    return (
      <div className="hoc-tu-vung-page">
        <Navbar />
        <div className="overview-hero">
          <div className="overview-hero-content">
            <button className="overview-back-btn" onClick={handleBack}>
              <ArrowLeft size={20} />
            </button>
            <div className="overview-info">
              <span className="lesson-badge">Bài học #{lessonId}</span>
              <h1>{lessonInfo?.tieuDe || "Nội dung bài học"}</h1>
              {lessonInfo?.moTa && <p className="lesson-desc-hero">{lessonInfo.moTa}</p>}
              <div className="overview-stats-bar">
                <div className="stats-text">
                  Tiến độ hoàn thành: <strong>{learnedCount}/{originalList.length} từ</strong>
                </div>
                <div className="stats-progress-track">
                  <div className="stats-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overview-content-wrapper">
          <div className="vocab-grid-premium">
            {originalList.map((item, index) => (
              <div key={item.maTuVung} className={`vocab-card-new ${item.daHoc ? "mastered" : ""}`}>
                <div className="vocab-card-img">
                  {item.anhMinhHoa ? (
                    <img src={item.anhMinhHoa} alt={item.tuTiengAnh} />
                  ) : (
                    <div className="img-placeholder">{item.tuTiengAnh.charAt(0)}</div>
                  )}
                  {item.daHoc && (
                    <div className="mastered-overlay">
                      <CheckCircle size={24} color="white" fill="#22c55e" />
                    </div>
                  )}
                </div>
                <div className="vocab-card-body">
                  <div className="vocab-card-header">
                    <h3>{item.tuTiengAnh}</h3>
                    <span className="phonetic-tag">{item.phienAm}</span>
                  </div>
                  <p className="vocab-card-mean">{item.nghiaTiengViet}</p>
                  <div className="vocab-card-footer">
                    <span className={`status-pill ${item.daHoc ? "done" : "todo"}`}>
                      {item.daHoc ? "Đã thuộc" : "Cần học"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-actions" style={{ marginTop: "30px", textAlign: "center", paddingBottom: "40px" }}>
          <button 
            className="node-action-btn btn-current" 
            onClick={startLearning}
            style={{ width: "fit-content", minWidth: "200px", padding: "12px 30px" }}
          >
            <Play size={20} fill="currentColor" />
            <span>{isAllLearned ? "Ôn tập lại tất cả" : "Tiếp tục học từ mới"}</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. Màn hình hoàn thành bài học
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
              {isPerfect ? "Tuyệt vời!" : isGood ? "Làm tốt lắm!" : "Cố gắng lên!"}
            </h2>
            <p className="finish-subtitle">
              {isPerfect 
                ? "Bạn đã hoàn thành bài học một cách hoàn hảo!" 
                : "Bạn đã hoàn thành các từ mới hôm nay. Hãy tiếp tục duy trì nhé!"}
            </p>

            <div className="finish-stats-grid">
              <div className="stat-box correct">
                <span className="stat-label">Đã học</span>
                <span className="stat-value">{score.correct}</span>
              </div>
              <div className="stat-box incorrect">
                <span className="stat-label">Chưa thuộc</span>
                <span className="stat-value">{score.incorrect}</span>
              </div>
            </div>

            <div className="finish-actions">
              <button 
                className="btn-primary-finish"
                onClick={handleBack}
              >
                Tiếp tục hành trình
              </button>
              <button 
                className="btn-secondary-finish"
                onClick={() => {
                  setIsOverview(true);
                  setIsFinished(false);
                }}
              >
                Xem lại danh sách
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Màn hình đang học (Flashcard)
  const currentWord = learningList[currentIndex];
  const totalWords = learningList.length;

  return (
    <div className="hoc-tu-vung-page">
      <Navbar />

      <div className="learning-top-header">
        <div className="learning-header-content">
          <button className="learning-back-btn" onClick={() => setIsOverview(true)}>
            <ArrowLeft size={18} />
            <span>Thoát</span>
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
        <FlashCard
          key={currentWord.maTuVung || currentIndex}
          word={currentWord.tuTiengAnh}
          phonetic={currentWord.phienAm}
          type={""}
          translation={currentWord.nghiaTiengViet}
          definition={currentWord.dinhNghia || "Đang cập nhật định nghĩa..."}
          exampleEn={currentWord.viDu || "Đang cập nhật ví dụ..."}
          exampleVi={""}
          image={currentWord.anhMinhHoa}
          difficulty={currentWord.doKho}
        />

        <LearningControls onNext={handleNextWord} />
      </main>
    </div>
  );
}
