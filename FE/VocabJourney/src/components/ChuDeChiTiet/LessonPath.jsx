import LessonItem from "./LessonItem.jsx";
import "./LessonPath.css";

export default function LessonPath() {
  const lessons = [
    {
      id: 1,
      title: "Tại Sân Bay",
      description: "Học từ vựng thiết yếu cho trải nghiệm tại sân bay",
      vocabCount: 12,
      status: "completed", // completed, current, locked
    },
    {
      id: 2,
      title: "Nhận Phòng Khách Sạn",
      description: "Nắm vững ngôn ngữ đặt phòng khách sạn",
      vocabCount: 10,
      status: "completed",
    },
    {
      id: 3,
      title: "Hỏi Đường",
      description: "Di chuyển trong thành phố một cách tự tin",
      vocabCount: 15,
      status: "current",
      progress: 60,
    },
    {
      id: 4,
      title: "Phương Tiện Công Cộng",
      description: "Từ vựng về xe buýt, tàu hỏa và taxi",
      vocabCount: 14,
      status: "locked",
    },
  ];
  const lastCompletedIndex = lessons.findLastIndex(
    (l) => l.status === "completed",
  );
  const totalNodes = lessons.length;
  const activeLineHeight =
    totalNodes > 1 ? `${(lastCompletedIndex / (totalNodes - 1)) * 100}%` : "0%";

  return (
    <div className="lesson-path-container">
      <div className="lesson-path-line">
        <div
          className="lesson-path-line-active"
          style={{ height: activeLineHeight }}
        ></div>
      </div>

      <div className="lesson-items-wrapper">
        {lessons.map((lesson, index) => {
          // Alternate alignment: left, right, left, right
          const alignment = index % 2 === 0 ? "left" : "right";

          return (
            <LessonItem
              key={lesson.id}
              number={index + 1}
              title={lesson.title}
              description={lesson.description}
              vocabCount={lesson.vocabCount}
              status={lesson.status}
              progress={lesson.progress}
              alignment={alignment}
            />
          );
        })}
      </div>
    </div>
  );
}
