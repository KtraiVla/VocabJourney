import "./StatsSection.css";
import StatCard from "./StatCard.jsx";
import { Zap, Award, Flame, Target } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      icon: <Zap size={42} strokeWidth={2.5} />,
      value: "2450",
      title: "Tổng Điểm XP",
      subtitle: "450 / 500 XP để đạt cấp 9",
      type: "purple",
      progress: 90,
    },
    {
      icon: <Award size={42} strokeWidth={2.5} />,
      value: "Lvl 8",
      title: "Cấp Độ Hiện Tại",
      badgeText: "🏆 Học Viên Nâng Cao",
      type: "blue",
    },
    {
      icon: <Flame size={42} strokeWidth={2.5} />,
      value: "12",
      title: "Chuỗi Ngày 🔥",
      badgeText: "Hãy duy trì!",
      type: "orange",
    },
    {
      icon: <Target size={42} strokeWidth={2.5} />,
      value: "65%",
      title: "Mục Tiêu Hằng Ngày",
      subtitle: "13 / 20 từ vựng hôm nay",
      type: "green",
      progress: 65,
    },
  ];

  return (
    <section className="stats-wrapper">
      <div className="container">
        <div className="stats-section">
          <div className="stats-header">
            <h2>🏆 Bảng Tiến Độ Của Bạn</h2>
            <p>Hãy tiếp tục phát huy nhé! 🎉</p>
          </div>

          <div className="stats-grid">
            {stats.map((item, index) => (
              <StatCard
                key={index}
                icon={item.icon}
                value={item.value}
                title={item.title}
                subtitle={item.subtitle}
                badgeText={item.badgeText}
                type={item.type}
                progress={item.progress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
