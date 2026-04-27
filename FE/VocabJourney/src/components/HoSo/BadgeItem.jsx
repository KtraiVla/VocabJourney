import React from "react";
import { Target, Flame, BookCopy } from "lucide-react";
import "./BadgeItem.css";

const getBadgeIcon = (id) => {
  switch (id) {
    case 1:
      return (
        <Target
          className="badge-icon-svg"
          style={{ color: "#ec4899" }}
          strokeWidth={2.5}
          size={24}
        />
      );
    case 2:
      return (
        <Flame
          className="badge-icon-svg"
          style={{ color: "#f97316" }}
          strokeWidth={2.5}
          size={24}
        />
      );
    case 3:
      return (
        <BookCopy
          className="badge-icon-svg"
          style={{ color: "#14b8a6" }}
          strokeWidth={2.5}
          size={24}
        />
      );
    default:
      return <Target className="badge-icon-svg" strokeWidth={2.5} size={24} />;
  }
};

function BadgeItem({ id, title, desc, date, bgColor }) {
  return (
    <div className="badge-item" style={{ backgroundColor: bgColor }}>
      <div className="badge-icon-container">{getBadgeIcon(id)}</div>
      <div className="badge-info">
        <h3 className="badge-title">{title}</h3>
        <p className="badge-desc">{desc}</p>
        <p className="badge-date">{date}</p>
      </div>
    </div>
  );
}

export default BadgeItem;
