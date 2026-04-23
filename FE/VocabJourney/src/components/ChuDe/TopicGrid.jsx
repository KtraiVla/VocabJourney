import "./TopicGrid.css";
import TopicCard from "./TopicCard";

const topicsData = [
  {
    title: "Du Lịch & Khám Phá",
    description: "Từ vựng thiết yếu cho các chuyến du lịch",
    lessons: 8,
    words: 96,
    percent: 75,
    overlay: "blue",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Tiếng Anh Thương Mại",
    description: "Từ vựng chuyên nghiệp cho công việc",
    lessons: 12,
    words: 144,
    percent: 45,
    overlay: "yellow",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Ẩm Thực & Nhà Hàng",
    description: "Từ vựng về nhà hàng và nấu ăn",
    lessons: 6,
    words: 72,
    percent: 90,
    overlay: "green",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Giao Tiếp Hàng Ngày",
    description: "Cụm từ thông dụng cho các tình huống hàng ngày",
    lessons: 10,
    words: 120,
    percent: 30,
    overlay: "purple",
    image:
      "https://images.unsplash.com/photo-1521791136364-708a16ac3310?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Công Nghệ",
    description: "Từ vựng liên quan đến công nghệ hiện đại",
    lessons: 7,
    words: 84,
    percent: 15,
    overlay: "pink",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Sức Khỏe & Thể Dục",
    description: "Từ vựng về sức khỏe và thể chất",
    lessons: 5,
    words: 60,
    percent: 60,
    overlay: "teal",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600",
  },
];

export default function TopicGird() {
  return (
    <div className="topics-grid-container">
      <div className="topics-grid">
        {topicsData.map((topic, index) => (
          <TopicCard key={index} {...topic} />
        ))}
      </div>
    </div>
  );
}
