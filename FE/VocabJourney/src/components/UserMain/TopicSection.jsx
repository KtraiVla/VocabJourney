import "./TopicSection.css";
import TopicCard from "./TopicCard.jsx";
import img1 from "../../assets/images/dulich.jpg";
import img2 from "../../assets/images/dongvat.jpg";
import img3 from "../../assets/images/nhahang.jpg";

export default function TopicsSection() {
  const topics = [
    {
      image: img1,
      title: "Du Lịch & Khám Phá",
      lessons: 8,
      words: 96,
      percent: 75,
      overlay: "blue",
    },
    {
      image: img2,
      title: "Thế giới động vật",
      lessons: 12,
      words: 144,
      percent: 45,
      overlay: "yellow",
    },
    {
      image: img3,
      title: "Ẩm Thực & Nhà Hàng",
      lessons: 6,
      words: 72,
      percent: 90,
      overlay: "green",
    },
  ];

  return (
    <section className="topics-section">
      <div className="topics-header">
        <h2>Khám Phá Chủ Đề</h2>
        <a href="#!" className="view-all-link">
          Xem Tất Cả →
        </a>
      </div>

      <div className="topics-grid">
        {topics.map((topic, index) => (
          <TopicCard
            key={index}
            image={topic.image}
            title={topic.title}
            lessons={topic.lessons}
            words={topic.words}
            percent={topic.percent}
            overlay={topic.overlay}
          />
        ))}
      </div>
    </section>
  );
}
