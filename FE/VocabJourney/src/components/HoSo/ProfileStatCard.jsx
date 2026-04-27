import "./ProfileStatCard.css";

export default function ProfileStatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="profile-stat-card">
      <div className="stat-card-top">
        <div className="profile-stat-icon-wrapper" style={{ color: color }}>
          <Icon size={24} strokeWidth={2.5}></Icon>
        </div>
        <div className="stat-card-value">{value}</div>
      </div>
      <div className="stat-card-label">{title}</div>
    </div>
  );
}
