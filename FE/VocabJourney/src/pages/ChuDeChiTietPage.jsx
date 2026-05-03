import { useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import TopicDetailBanner from "../components/ChuDeChiTiet/TopicDetailBanner.jsx";
import LessonPath from "../components/ChuDeChiTiet/LessonPath.jsx";
import QuizBanner from "../components/ChuDeChiTiet/QuizBanner.jsx";
import "./ChuDeChiTiet.css";

export default function ChuDeChiTietPage() {
  const location = useLocation();
  const topicState = location.state || {};

  const topicData = {
    title: topicState.title || "Du Lịch & Khám Phá",
    description: topicState.description || "Khám phá thế giới với vốn từ vựng phong phú về du lịch, khách sạn và văn hóa.",
    stats: {
      lessons: topicState.lessons || 12,
      vocab: topicState.words || 150,
      completedRate: topicState.percent || 45,
    },
    progress: topicState.percent || 45,
  };

  return (
    <div className="topic-detail-page">
      <Navbar></Navbar>
      <div className="topic-detail-container">
        <TopicDetailBanner
          title={topicData.title}
          description={topicData.description}
          stats={topicData.stats}
          progress={topicData.progress}
        />
        <LessonPath></LessonPath>
        <QuizBanner></QuizBanner>
      </div>
    </div>
  );
}
