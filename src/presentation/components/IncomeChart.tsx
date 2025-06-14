"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/presentation/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";

interface IncomeChartProps {
  incomeData: {
    name: string;
    earned: number;
    color: string;
  }[];
  totalEarned: number;
}

export function IncomeChart({ incomeData, totalEarned }: IncomeChartProps) {
  // Format data for the chart
  const chartData = incomeData.map((income) => ({
    name: income.name,
    value: income.earned,
    fill: income.color,
  }));

  const chartConfig = incomeData.reduce<
    Record<string, { label: string; color: string }>
  >((acc, income) => {
    acc[income.name.toLowerCase()] = {
      label: income.name,
      color: income.color,
    };
    return acc;
  }, {});

  return (
    <div className="relative flex aspect-square h-[180px] items-center justify-center">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={86}
            paddingAngle={2}
            dataKey="value"
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-2xl font-bold"
                      >
                        ₱{totalEarned.toLocaleString()}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
