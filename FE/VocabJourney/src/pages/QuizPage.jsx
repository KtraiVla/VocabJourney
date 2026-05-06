import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Navbar from "../components/common/Navbar.jsx";
import QuizCard from "../components/Quiz/QuizCard.jsx";
import QuizResult from "../components/Quiz/QuizResult.jsx";
import progressService from "../services/progressService";
import quizService from "../services/quizService";
import "./QuizPage.css";

export default function QuizPage() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  
  const [quizList, setQuizList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizId, setQuizId] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        const result = await quizService.getQuizByLesson(lessonId);
        if (result.success && result.data && result.data.danhSachCauHoi) {
          // Chuyển đổi format từ BE sang FE
          const formattedQuiz = result.data.danhSachCauHoi.map(q => ({
            id: q.maCauHoi,
            question: q.noiDung,
            options: q.options || [],
            correctAnswer: q.correctAnswerIndex,
            type: "Trắc nghiệm"
          }));
          setQuizId(result.data.maBaiKiemTra);
          setQuizList(formattedQuiz);
        }
      } catch (error) {
        console.error("Lỗi tải quiz:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonId) {
      fetchQuizData();
    }
  }, [lessonId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="quiz-page-wrapper">
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
          <Loader2 className="animate-spin" size={48} color="#6366f1" />
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  if (!quizList || quizList.length === 0) {
    return (
      <div className="quiz-page-wrapper">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Bài học này hiện chưa có câu hỏi trắc nghiệm!</h2>
          <button 
            onClick={handleBack}
            style={{ padding: '10px 24px', borderRadius: '8px', background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = quizList.length;
  const currentQuestion = quizList[currentStep] || {};

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) setScore(score + 1);
    setAnswers([...answers, { questionId: currentQuestion.id, selected: selectedOption, isCorrect }]);
    setIsAnswered(true);
  };

  const handleNextQuestion = async () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsSaving(true);
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung && quizId) {
          await progressService.saveQuizResult(maNguoiDung, score, totalQuestions, quizId);
        }
        setIsFinished(true);
      } catch (error) {
        console.error("Lỗi khi lưu kết quả Quiz:", error);
        setIsFinished(true);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isFinished) {
    return (
      <div className="quiz-page-wrapper">
        <Navbar />
        <QuizResult 
          score={score} 
          total={totalQuestions} 
          onRestart={() => {
            setCurrentStep(0);
            setSelectedOption(null);
            setIsAnswered(false);
            setScore(0);
            setIsFinished(false);
            setAnswers([]);
          }}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="quiz-page-wrapper">
      <Navbar />
      <div className="quiz-container">
        <header className="quiz-header">
          <div className="quiz-header-top">
            <button className="quiz-back-btn" onClick={handleBack}>
              <ArrowLeft size={20} />
            </button>
            <h2 className="quiz-title">Bài kiểm tra năng lực</h2>
            <span className="quiz-progress-text">
              Câu hỏi {currentStep + 1} / {totalQuestions}
            </span>
          </div>
          <div className="quiz-progress-bar-container">
            <div className="quiz-progress-bar-fill" style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}></div>
          </div>
        </header>

        <main className="quiz-main">
          <QuizCard question={currentQuestion} selectedOption={selectedOption} onSelect={handleSelectOption} isAnswered={isAnswered} />
          <div className="quiz-actions">
            {!isAnswered ? (
              <button className={`btn-submit-answer ${selectedOption !== null ? 'active' : ''}`} onClick={handleSubmitAnswer} disabled={selectedOption === null}>
                Gửi câu trả lời
              </button>
            ) : (
              <button className="btn-next-question" onClick={handleNextQuestion} disabled={isSaving}>
                {isSaving ? "Đang lưu kết quả..." : (currentStep < totalQuestions - 1 ? 'Câu tiếp theo' : 'Xem kết quả')}
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
