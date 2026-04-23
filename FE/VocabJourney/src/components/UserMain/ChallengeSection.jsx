import "./ChallengeSection.css";
import ChallengeItem from "./ChallengeItem.jsx";
import { Target } from "lucide-react";

export default function ChallengesSection() {
  const challenges = [
    {
      title: "Nhà Vô Địch Hàng Ngày",
      desc: "Hoàn thành 5 bài học hôm nay",
      reward: 100,
      progress: 3,
      total: 5,
    },
    {
      title: "Bậc Thầy Quiz",
      desc: "Đạt điểm 100% trong 3 bài kiểm tra",
      reward: 250,
      progress: 1,
      total: 3,
    },
    {
      title: "Ôn Tập Đều Đặn",
      desc: "Ôn tập 50 từ trong tuần này",
      reward: 200,
      progress: 32,
      total: 50,
    },
  ];

  return (
    <section className="challenges-section">
      <div className="challenges-header">
        <div className="challenges-header-icon">
          <Target size={24} color="white" />
        </div>
        <h3>Thử Thách Hàng Ngày</h3>
      </div>

      <div className="challenges-list">
        {challenges.map((item, index) => (
          <ChallengeItem
            key={index}
            title={item.title}
            desc={item.desc}
            reward={item.reward}
            progress={item.progress}
            total={item.total}
          />
        ))}
      </div>
    </section>
  );
}
