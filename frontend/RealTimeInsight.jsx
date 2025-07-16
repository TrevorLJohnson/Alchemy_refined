import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function RealTimeInsight({ timestamp, currentCategories }) {
  if (!currentCategories || currentCategories.length === 0) {
    return (
      <div className="bg-dark-panel p-4 rounded flex items-center justify-center">
        No data yet
      </div>
    );
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#0088FE', '#FF8042'];

  return (
    <div className="bg-dark-panel p-4 rounded">
      <h3 className="text-lg font-semibold text-purple-400">Real-Time Insight</h3>
      {timestamp && (
        <h4 className="mt-2 font-medium text-purple-300">{timestamp}</h4>
      )}

      <PieChart width={250} height={250}>
        <Pie
          data={currentCategories}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {currentCategories.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value}%`, name]} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </div>
  );
}
