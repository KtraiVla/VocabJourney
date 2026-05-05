import React, { useState, useEffect } from "react";
import "./TopicProgressList.css";
import { Hash, ChevronDown, ChevronUp } from "lucide-react";
import TopicProgressItem from "./TopicProgressItem.jsx";
import topicService from "../../services/topicService";

export default function TopicProgressList() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // Trạng thái xem thêm

  useEffect(() => {
    const fetchTopicProgress = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await topicService.getAllTopics(maNguoiDung);
          if (response && response.data) {
            const colors = ["#06b6d4", "#a855f7", "#22c55e", "#f97316", "#ec4899", "#3b82f6", "#ef4444"];
            const formattedTopics = response.data.map((item, index) => ({
              name: item.tenChuDe,
              percentage: item.tienDo || 0,
              color: colors[index % colors.length],
              icon: <Hash size={18} />
            }));
            
            // Sắp xếp theo tiến độ giảm dần để hiện những cái đang học dở lên đầu
            formattedTopics.sort((a, b) => b.percentage - a.percentage);
            
            setTopics(formattedTopics);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải tiến độ chủ đề:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopicProgress();
  }, []);

  if (loading) return <div className="loading-topics">Đang tải tiến độ chủ đề...</div>;

  // Lấy danh sách hiển thị (5 cái đầu hoặc tất cả)
  const displayedTopics = showAll ? topics : topics.slice(0, 5);

  return (
    <div className="topic-progress-card">
      <h3 className="topic-progress-title">Tiến Độ Theo Chủ Đề</h3>
      <div className="topic-progress-list">
        {topics.length > 0 ? (
          <>
            {displayedTopics.map((topic, index) => (
              <TopicProgressItem
                key={index}
                name={topic.name}
                percentage={topic.percentage}
                color={topic.color}
                icon={topic.icon}
              />
            ))}
            
            {topics.length > 5 && (
              <button 
                className="show-more-btn" 
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? (
                  <>Thu gọn <ChevronUp size={16} /></>
                ) : (
                  <>Xem thêm ({topics.length - 5} chủ đề khác) <ChevronDown size={16} /></>
                )
              }
              </button>
            )}
          </>
        ) : (
          <p className="no-data">Chưa có dữ liệu tiến độ.</p>
        )}
      </div>
    </div>
  );
}
