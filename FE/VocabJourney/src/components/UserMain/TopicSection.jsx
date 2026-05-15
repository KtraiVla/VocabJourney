import React, { useState, useEffect } from "react";
import "./TopicSection.css";
import TopicCard from "./TopicCard.jsx";
import imgDefault from "../../assets/images/dulich.jpg";
import topicService from "../../services/topicService";
import { Link } from "react-router-dom";

export default function TopicsSection() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        const response = await topicService.getAllTopics(maNguoiDung);
        if (response.data) {
          // Lấy 3 chủ đề đầu tiên để hiển thị ở trang chủ
          setTopics(response.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chủ đề:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  if (loading) return <div className="topics-section">Đang tải chủ đề...</div>;

  const overlays = ["blue", "yellow", "green", "purple"];

  return (
    <section className="topics-section">
      <div className="topics-header">
        <h2>Khám Phá Chủ Đề</h2>
        <Link to="/chude" className="view-all-link">
          Xem Tất Cả →
        </Link>
      </div>

      <div className="topics-section-grid">
        {topics.map((topic, index) => (
          <TopicCard
            key={topic.maChuDe}
            id={topic.maChuDe}
            image={topic.anhMinhHoa || imgDefault}
            title={topic.tenChuDe}
            lessons={topic.soBaiHoc}
            words={topic.soTuVung}
            percent={topic.tienDo}
            overlay={overlays[index % overlays.length]}
          />
        ))}
      </div>
    </section>
  );
}
