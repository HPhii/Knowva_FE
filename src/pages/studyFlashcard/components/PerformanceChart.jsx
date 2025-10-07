import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const PerformanceChart = ({ stats }) => {
  if (!stats) return null;

  const { retentionRate, totalAttempts } = stats;
  const knowCount = Math.round((retentionRate / 100) * totalAttempts);
  const dontKnowCount = totalAttempts - knowCount;

  const data = [
    { name: "Know", value: knowCount, color: "#52c41a" },
    { name: "Don't Know", value: dontKnowCount, color: "#ffa940" },
  ];

  const COLORS = ["#A4F07F", "#FDBB6B"];

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-60 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-[#1F2937]">
            {retentionRate.toFixed(0)}%
          </div>
          <div className="text-base font-medium text-[#1F2937]">Know</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
