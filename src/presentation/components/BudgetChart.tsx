"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/presentation/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";

interface BudgetChartProps {
  budgetData: {
    name: string;
    spent: number;
    limit: number;
    color: string;
  }[];
  totalSpent: number;
  totalLimit: number;
}

export function BudgetChart({
  budgetData,
  totalSpent,
  totalLimit,
}: BudgetChartProps) {
  // Format data for the chart
  const chartData = budgetData.map((budget) => ({
    name: budget.name,
    value: budget.spent,
    fill: budget.color,
  }));

  const chartConfig = budgetData.reduce<
    Record<string, { label: string; color: string }>
  >((acc, budget) => {
    acc[budget.name.toLowerCase()] = {
      label: budget.name,
      color: budget.color,
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
                        ₱{totalSpent.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        of ₱{totalLimit.toLocaleString()} limit
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
