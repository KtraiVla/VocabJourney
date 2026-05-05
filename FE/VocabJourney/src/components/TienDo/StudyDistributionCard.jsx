import React, { useState, useEffect } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import "./StudyDistributionCard.css";
import statsService from "../../services/statsService";

function CustomTooltip({ active, payload, total }) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    const percent = ((data.value / total) * 100).toFixed(1);
    return (
      <div className="custom-tooltip">
        <p style={{ color: data.color }} className="tooltip-label">
          {data.name}
        </p>
        <p className="tooltip-value">Số từ: {data.value}</p>
        <p className="tooltip-value">{percent}%</p>
      </div>
    );
  }
  return null;
}

export default function StudyDistributionCard() {
  const [distributionData, setDistributionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const maNguoiDung = localStorage.getItem("maNguoiDung");
        if (maNguoiDung) {
          const response = await statsService.getStudyDistribution(maNguoiDung);
          if (response && response.data && response.data.success) {
            const colors = ["#06b6d4", "#a855f7", "#22c55e", "#f97316", "#ec4899", "#3b82f6", "#ef4444"];
            const formattedData = response.data.data.map((item, index) => ({
              ...item,
              color: colors[index % colors.length]
            }));
            setDistributionData(formattedData);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải phân bổ học tập:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDistribution();
  }, []);

  const total = distributionData.reduce((acc, curr) => acc + curr.value, 0);

  if (loading) return <div className="loading-chart">Đang tải phân bổ...</div>;

  return (
    <div className="study-distribution-card">
      <h3 className="distribution-title">Phân Bổ Theo Chủ Đề</h3>
      <div className="distribution-content">
        <div className="donut-container-recharts">
          {distributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={(props) => <CustomTooltip {...props} total={total} />}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data-pie">Chưa có dữ liệu học tập.</div>
          )}
        </div>
        <div className="distribution-legend">
          {distributionData.map((topic, index) => (
            <div key={index} className="legend-item">
              <div className="legend-item-left">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: topic.color }}
                ></span>
                <span className="legend-name">{topic.name}</span>
              </div>
              <span className="legend-percentage">
                {total > 0 ? ((topic.value / total) * 100).toFixed(0) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
