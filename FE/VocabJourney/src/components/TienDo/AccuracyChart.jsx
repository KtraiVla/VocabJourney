import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./AccuracyChart.css";
import statsService from "../../services/statsService";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">Ngày: {label}</p>
        <p className="tooltip-value"> Độ chính xác: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
}

export default function AccuracyChart() {
  const [accuracyData, setAccuracyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccuracy = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await statsService.getAccuracyTrend(maNguoiDung);
          if (response && response.data && response.data.success) {
            setAccuracyData(response.data.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải xu hướng độ chính xác:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccuracy();
  }, []);

  if (loading) return <div className="loading-chart">Đang tải biểu đồ...</div>;

  return (
    <div className="accuracy-chart-card">
      <h3 className="accuracy-chart-title">Xu Hướng Độ Chính Xác (5 bài gần nhất)</h3>
      <div className="chart-container-recharts">
        {accuracyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={accuracyData}
              margin={{ top: 10, right: 15, left: -25, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#f1f5f9", strokeWidth: 2 }}
              />
              <Line
                dataKey="value"
                type="monotone"
                stroke="#a855f7"
                strokeWidth={3}
                activeDot={{
                  r: 6,
                  fill: "#a855f7",
                  stroke: "white",
                  strokeWidth: 2,
                }}
                dot={{ r: 4, fill: "#a855f7", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="no-data-msg" style={{ textAlign: "center", paddingTop: "50px", color: "#94a3b8" }}>
            Chưa có đủ dữ liệu bài kiểm tra.
          </div>
        )}
      </div>
    </div>
  );
}
