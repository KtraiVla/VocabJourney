import "./CongDong.css";

const stats = [
  { value: "10,452", label: "Người Học Tích Cực", emoji: "👥" },
  { value: "2.5M", label: "Từ Vựng Đã Học Hôm Nay", emoji: "📚" },
];

export default function CongDong() {
  return (
    <div className="db-block community-block">
      <div className="db-block-header">
        <span className="db-block-icon community-icon">👥</span>
        <h3>Cộng Đồng</h3>
      </div>
      <div className="community-stats">
        {stats.map((s, i) => (
          <div key={i} className="community-stat-row">
            <div>
              <p className="stat-big">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
            <span className="stat-emoji">{s.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
