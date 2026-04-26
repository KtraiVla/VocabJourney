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

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tool-tip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value"> Độ chính xác: {payload[0].value}</p>
      </div>
    );
  }
  return null;
}

export default function AccuracyChart() {
  const data = [
    { label: "Tuần 1", value: 60 },
    { label: "Tuần 2", value: 75 },
    { label: "Tuần 3", value: 88 },
    { label: "Tuần 4", value: 95 },
  ];

  return (
    <div className="accuracy-chart-card">
      <h3 className="accuracy-chart-title">Xu Hướng Độ Chính Xác</h3>
      <div className="chart-container-recharts">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 15, left: -25, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            ></CartesianGrid>

            {/* Trục X  */}
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={10}
            ></XAxis>

            {/* Trục Y */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            ></YAxis>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#f1f5f9", strokeWidth: 2 }}
            ></Tooltip>

            <Line
              dataKey="value"
              type="monotone"
              stroke="#a855f7"
              strokeWidth={3}
              activeDot={{
                r: 6,
                fill: "#a855f7",
                stroke: "while",
                strokeWidth: 2,
              }}
              dot={{ r: 4, fill: "#a855f7", strokeWidth: 0 }}
            ></Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
