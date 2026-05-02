import Navbar from "../components/common/Navbar.jsx";
import TopicDetailBanner from "../components/ChuDeChiTiet/TopicDetailBanner.jsx";
import LessonPath from "../components/ChuDeChiTiet/LessonPath.jsx";
import QuizBanner from "../components/ChuDeChiTiet/QuizBanner.jsx";
import "./ChuDeChiTiet.css";

export default function ChuDeChiTietPage() {
  const topicData = {
    title: "Du Lịch & Khám Phá",
    description:
      "Khám phá thế giới với vốn từ vựng phong phú về du lịch, khách sạn và văn hóa.",
    stats: {
      lessons: 12,
      vocab: 150,
      completedRate: 45,
    },
    progress: 45,
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
