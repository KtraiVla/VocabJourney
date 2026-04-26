import {
  BarChart, // khung của biểu đồ
  Bar, // cột của biểu đồ
  XAxis,
  YAxis,
  CartesianGrid, // đường kẻ nền
  Tooltip, // hộp thông tin khi trỏ chuột
  ResponsiveContainer,
} from "recharts";

// tạo một hộp thông tin tùy chỉnh
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">Ngày: {label}</p>
        <p className="tooltip-value">Đã học: {payload[0].value}</p>
      </div>
    );
  }
  return null;
}

function WeeklyActivityChart() {
  const weeklyData = [
    { day: "T2", value: 12 },
    { day: "T3", value: 15 },
    { day: "T4", value: 10 },
    { day: "T5", value: 17 },
    { day: "T6", value: 9 },
    { day: "T7", value: 20 },
    { day: "CN", value: 19 },
  ];

  return (
    <div className="activity-chart-card">
      <h3 className="activity-chart-title">Hoạt Động Học Tập Hàng Tuần</h3>
      <div className="chart-container-recharts">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklyData}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            {/* trục X */}
            <XAxis
              dataKey="day"
              axisLine="false"
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={10}
            ></XAxis>

            {/* trục Y */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              domain={[0, 25]}
              ticks={[0, 5, 10, 15, 20, 25]}
            ></YAxis>

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#f8fafc" }}
            ></Tooltip>

            <Bar
              dataKey="value"
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            ></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend">
        <span className="legend-color-box"></span>
        <span className="legend-text">Từ Đã Học</span>
      </div>
    </div>
  );
}

export default WeeklyActivityChart;
