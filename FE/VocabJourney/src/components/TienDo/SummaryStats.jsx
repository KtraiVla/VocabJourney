import { BookOpen, Target, Award, Calendar } from "lucide-react";
import SummaryCard from "./SummaryCard.jsx";
import "./SummaryStats.css";

export default function SummaryStats() {
  const stats = [
    {
      value: "347",
      label: "Tổng Từ Đã Học",
      icon: <BookOpen />,
      background: "linear-gradient(135deg, #06b6d4, #0891b2)",
    },
    {
      value: "23",
      label: "Bài Học Hoàn Thành",
      icon: <Target />,
      background: "linear-gradient(135deg, #a855f7, #9333ea)",
    },
    {
      value: "91%",
      label: "Độ Chính Xác Trung Bình",
      icon: <Award />,
      background: "linear-gradient(135deg, #22c55e, #16a34a)",
    },
    {
      value: "12",
      label: "Chuỗi Ngày Học",
      icon: <Calendar />,
      background: "linear-gradient(135deg, #f97316, #ea580c)",
    },
  ];

  return (
    <div className="summary-stats-grid">
      {stats.map((stat, index) => (
        <SummaryCard
          key={index}
          value={stat.value}
          label={stat.label}
          icon={stat.icon}
          background={stat.background}
        />
      ))}
    </div>
  );
}
