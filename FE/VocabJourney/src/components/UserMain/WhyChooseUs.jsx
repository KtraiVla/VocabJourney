import "./WhyChooseUs.css";
import { BookOpen, Brain, LineChart, Trophy } from "lucide-react";

const features = [
  {
    icon: <BookOpen size={32} />,
    title: "Học Từ Vựng",
    desc: "Thành thạo từ vựng với flashcard thông minh",
    color: "#2563eb",
  },
  {
    icon: <Brain size={32} />,
    title: "Làm Bài Quiz",
    desc: "Kiểm tra kiến thức một cách tương tác",
    color: "#a855f7",
  },
  {
    icon: <LineChart size={32} />,
    title: "Theo Dõi Tiến Độ",
    desc: "Xem sự tiến bộ của bạn theo thời gian",
    color: "#10b981",
  },
  {
    icon: <Trophy size={32} />,
    title: "Nhận Phần Thưởng",
    desc: "Mở khóa huy hiệu và thành tích",
    color: "#f59e0b",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-choose-us">
      <h2 className="why-title">Tại Sao Chọn VocabJourney?</h2>
      <div className="why-grid">
        {features.map((f, i) => (
          <div key={i} className="why-item">
            <div 
              className="why-icon-wrap" 
              style={{ backgroundColor: f.color }}
            >
              {f.icon}
            </div>
            <h3 className="why-item-title">{f.title}</h3>
            <p className="why-item-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
