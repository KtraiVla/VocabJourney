import "./SummaryCard.css";

export default function SummaryCard({ value, label, icon, background }) {
  return (
    <div className="summary-card" style={{ background }}>
      <div className="summary-card-icon">{icon}</div>
      <div className="summary-card-content">
        <h3 className="summary-card-value">{value}</h3>
        <p className="summary-card-label">{label}</p>
      </div>
    </div>
  );
}
