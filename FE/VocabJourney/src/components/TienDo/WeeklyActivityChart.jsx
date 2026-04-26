import "./WeeklyActivityChart.css";

export default function WeeklyActivityChart() {
  const data = [
    { day: "T2", value: 12 },
    { day: "T3", value: 15 },
    { day: "T4", value: 10 },
    { day: "T5", value: 18 },
    { day: "T6", value: 14 },
    { day: "T7", value: 21 },
    { day: "CN", value: 16 },
  ];

  const maxValue = 20;
  return (
    <div className="activity-chart-card">
      <h3 className="activity-chart-title">Hoạt Động Học Tập Hàng Tuần</h3>

      <div className="chart-container">
        {/* Y-axis labels */}
        <div className="y-axis">
          <span>20</span>
          <span>15</span>
          <span>10</span>
          <span>5</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="chart-area">
          {/* Grid lines */}
          <div className="grid-lines">
            <div className="grid-line"></div>
            <div className="grid-line"></div>
            <div className="grid-line"></div>
            <div className="grid-line"></div>
            <div className="grid-line"></div>
          </div>

          {/* Bars */}
          <div className="bars-container">
            {data.map((item, index) => {
              const heightPercent = Math.min(
                (item.value / maxValue) * 100,
                100,
              );
              return (
                <div key={index} className="bar-wrapper">
                  <div
                    className="bar"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  <span className="x-axis-label">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="chart-legend">
        <span className="legend-color-box"></span>
        <span className="legend-text">Từ Đã Học</span>
      </div>
    </div>
  );
}
