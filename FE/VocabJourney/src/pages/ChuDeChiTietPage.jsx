import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import TopicDetailBanner from "../components/ChuDeChiTiet/TopicDetailBanner.jsx";
import LessonPath from "../components/ChuDeChiTiet/LessonPath.jsx";
import QuizBanner from "../components/ChuDeChiTiet/QuizBanner.jsx";
import topicService from "../services/topicService.js";
import "./ChuDeChiTiet.css";

export default function ChuDeChiTietPage() {
  const { id } = useParams();
  const location = useLocation();
  const [topicData, setTopicData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopicDetail = async () => {
      try {
        setIsLoading(true);
        // Luôn gọi API để lấy dữ liệu mới nhất (đặc biệt là Tiến độ)
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        const response = await topicService.getTopicById(id, maNguoiDung);
        const topic = response.data;

        setTopicData({
          title: topic.tenChuDe,
          description: topic.moTa,
          image: topic.anhMinhHoa,
          stats: {
            lessons: topic.soBaiHoc,
            vocab: topic.soTuVung,
            completedRate: topic.tienDo || 0,
          },
          progress: topic.tienDo || 0,
        });
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết chủ đề:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTopicDetail();
    }
  }, [id, location.state]);

  if (isLoading) {
    return (
      <div className="topic-detail-page">
        <Navbar />
        <div style={{ textAlign: "center", marginTop: "100px" }}>Đang tải...</div>
      </div>
    );
  }

  if (!topicData) {
    return (
      <div className="topic-detail-page">
        <Navbar />
        <div style={{ textAlign: "center", marginTop: "100px" }}>Không tìm thấy chủ đề.</div>
      </div>
    );
  }

  return (
    <div className="topic-detail-page">
      <Navbar />
      <div className="topic-detail-container">
        <TopicDetailBanner
          title={topicData.title}
          description={topicData.description}
          stats={topicData.stats}
          progress={topicData.progress}
          image={topicData.image}
        />
        <LessonPath />
        <QuizBanner />
      </div>
    </div>
  );
}
