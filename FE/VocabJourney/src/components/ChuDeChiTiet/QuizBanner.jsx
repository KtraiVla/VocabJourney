import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trophy, Lock, PlayCircle, CheckCircle2 } from "lucide-react";
import baihocService from "../../services/baihocService.js";
import "./QuizBanner.css";

export default function QuizBanner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        const response = await baihocService.getLessonsByTopic(id, maNguoiDung);
        
        if (response.data.success) {
          const quizList = response.data.data.map((bh, index) => ({
            id: bh.maBaiKiemTra || `temp-${bh.maBaiHoc}`,
            lessonTitle: bh.tieuDe,
            lessonId: bh.maBaiHoc,
            isLocked: !bh.daHoanThanh, // Khóa nếu chưa học xong bài học
            isCompleted: bh.quizHoanThanh,
            number: index + 1
          }));
          setQuizzes(quizList);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách Quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuizzes();
  }, [id]);

  if (loading) return null;

  return (
    <div className="quiz-section-wrapper">
      <div className="quiz-section-header">
        <div className="quiz-section-title">
          <Trophy className="title-icon" size={28} />
          <h2>Kiểm tra kiến thức</h2>
        </div>
        <p className="quiz-section-desc">
          Hoàn thành bài học để mở khóa bài kiểm tra tương ứng. Chinh phục tất cả để nhận thưởng XP!
        </p>
      </div>

      <div className="quiz-cards-grid">
        {quizzes.map((quiz) => (
          <div 
            key={quiz.id} 
            className={`quiz-card-item ${quiz.isLocked ? 'locked' : ''} ${quiz.isCompleted ? 'completed' : ''}`}
            onClick={() => !quiz.isLocked && navigate(`/quiz/${quiz.lessonId}`)}
          >
            <div className="quiz-card-number">Bài {quiz.number}</div>
            <div className="quiz-card-icon">
              {quiz.isCompleted ? (
                <CheckCircle2 size={32} className="icon-completed" />
              ) : quiz.isLocked ? (
                <Lock size={32} className="icon-locked" />
              ) : (
                <PlayCircle size={32} className="icon-ready" />
              )}
            </div>
            <div className="quiz-card-info">
              <h4>{quiz.lessonTitle}</h4>
              <span className="quiz-status-text">
                {quiz.isCompleted ? "Đã hoàn thành" : quiz.isLocked ? "Đang khóa" : "Sẵn sàng"}
              </span>
            </div>
            {!quiz.isLocked && !quiz.isCompleted && (
              <div className="quiz-card-badge">Mở khóa</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
