"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Budget } from "../../overview/_data";

interface SpendingSummaryChartProps {
  budgets: Budget[];
}

export function SpendingSummaryChart({ budgets }: SpendingSummaryChartProps) {
  // Format data for the chart
  const chartData = budgets.map((budget) => ({
    name: budget.name,
    value: budget.spent,
    color: budget.color,
  }));

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              `₱${value.toLocaleString()}`,
              "Spent",
            ]}
            labelFormatter={(name) => name as string}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
