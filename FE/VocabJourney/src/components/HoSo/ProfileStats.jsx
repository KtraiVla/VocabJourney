import "./ProfileStats.css";
import { BookOpen, Flame, Medal, TrendingUp } from "lucide-react";
import ProfileStatCard from "./ProfileStatCard.jsx";

export default function ProfileStats() {
  const stats = [
    {
      id: 1,
      title: "Từ đã học",
      value: "347",
      icon: BookOpen,
      color: "#0ea5e9",
    },
    { id: 2, title: "Chuỗi ngày", value: "12", icon: Flame, color: "#f97316" },
    {
      id: 3,
      title: "Huy hiệu đạt được",
      value: "3",
      icon: Medal,
      color: "#eab308",
    },
    {
      id: 4,
      title: "Độ chính xác TB",
      value: "91%",
      icon: TrendingUp,
      color: "#22c55e",
    },
  ];

  return (
    <div className="profile-stats-grid">
      {stats.map((stat) => (
        <ProfileStatCard key={stat.id} {...stat}></ProfileStatCard>
      ))}
    </div>
  );
}
