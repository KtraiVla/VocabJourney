import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "../components/common/Navbar.jsx";
import QuizCard from "../components/Quiz/QuizCard.jsx";
import QuizResult from "../components/Quiz/QuizResult.jsx";
import "./QuizPage.css";

const MOCK_QUIZ = [
  {
    id: 1,
    question: '"Luggage" có nghĩa là gì?',
    options: [
      "Túi xách và vali để đi du lịch",
      "Một loại phương tiện",
      "Phòng khách sạn",
      "Tài liệu du lịch"
    ],
    correctAnswer: 0,
    type: "Trắc nghiệm"
  },
  {
    id: 2,
    question: '"Passport" dùng để làm gì?',
    options: [
      "Để thanh toán tiền",
      "Để đi lại quốc tế",
      "Để đặt phòng khách sạn",
      "Để xem bản đồ"
    ],
    correctAnswer: 1,
    type: "Trắc nghiệm"
  },
  {
    id: 3,
    question: '"Destination" nghĩa là gì?',
    options: [
      "Phương tiện di chuyển",
      "Điểm đến",
      "Khởi hành",
      "Vé máy bay"
    ],
    correctAnswer: 1,
    type: "Trắc nghiệm"
  },
  {
    id: 4,
    question: '"Flight" là gì?',
    options: [
      "Chuyến tàu",
      "Chuyến xe buýt",
      "Chuyến bay",
      "Chuyến phà"
    ],
    correctAnswer: 2,
    type: "Trắc nghiệm"
  }
];

export default function QuizPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0: Câu hỏi 1, 1: Câu hỏi 2...
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState([]); // Lưu lịch sử trả lời

  const totalQuestions = MOCK_QUIZ.length;
  const currentQuestion = MOCK_QUIZ[currentStep];

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) setScore(score + 1);

    setAnswers([...answers, {
      questionId: currentQuestion.id,
      selected: selectedOption,
      isCorrect
    }]);

    setIsAnswered(true);

    // Tự động chuyển câu sau 1.5s hoặc đợi bấm nút "Tiếp theo"
    // Ở đây tôi chọn bấm nút để người dùng kịp nhìn đáp án đúng/sai
  };

  const handleNextQuestion = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    navigate("/chudechitiet");
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
            <h2 className="quiz-title">Bài kiểm tra nhanh</h2>
            <span className="quiz-progress-text">
              Câu hỏi {currentStep + 1} / {totalQuestions}
            </span>
          </div>
          
          <div className="quiz-progress-bar-container">
            <div 
              className="quiz-progress-bar-fill" 
              style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </header>

        <main className="quiz-main">
          <QuizCard 
            question={currentQuestion}
            selectedOption={selectedOption}
            onSelect={handleSelectOption}
            isAnswered={isAnswered}
          />
          
          <div className="quiz-actions">
            {!isAnswered ? (
              <button 
                className={`btn-submit-answer ${selectedOption !== null ? 'active' : ''}`}
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
              >
                Gửi câu trả lời
              </button>
            ) : (
              <button 
                className="btn-next-question"
                onClick={handleNextQuestion}
              >
                {currentStep < totalQuestions - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
