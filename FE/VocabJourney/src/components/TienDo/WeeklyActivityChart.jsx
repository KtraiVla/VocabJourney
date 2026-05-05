import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./WeeklyActivityChart.css";
import statsService from "../../services/statsService";

// tạo một hộp thông tin tùy chỉnh
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">Ngày: {label}</p>
        <p className="tooltip-value">Đã học: {payload[0].value} từ</p>
      </div>
    );
  }
  return null;
}

function WeeklyActivityChart() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await statsService.getWeeklyActivity(maNguoiDung);
          if (response && response.data && response.data.success) {
            setWeeklyData(response.data.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải hoạt động tuần:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  if (loading) return <div className="loading-chart">Đang tải biểu đồ...</div>;

  return (
    <div className="activity-chart-card">
      <h3 className="activity-chart-title">Hoạt Động Học Tập 7 Ngày Qua</h3>
      <div className="chart-container-recharts">
        {weeklyData.length > 0 ? (
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
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar
                dataKey="value"
                fill="#06b6d4"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="no-data-msg" style={{ textAlign: "center", paddingTop: "50px", color: "#94a3b8" }}>
            Chưa có hoạt động nào trong 7 ngày qua.
          </div>
        )}
      </div>

      <div className="chart-legend">
        <span className="legend-color-box"></span>
        <span className="legend-text">Số Từ Đã Học</span>
      </div>
    </div>
  );
}

export default WeeklyActivityChart;
