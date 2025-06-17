"use client";

import { Badge } from "@/presentation/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Separator } from "@/presentation/components/ui/separator";
import { Activity, Calendar, TrendingDown, TrendingUp } from "lucide-react";

// Mock data for demonstration
const mockSummaryData = {
  totalMonthlyIncome: 5500,
  totalMonthlyExpenses: 3200,
  netMonthlyFlow: 2300,
  activeFlows: 12,
  pausedFlows: 2,
  upcomingThisWeek: 5,
  topFlows: [
    {
      id: "1",
      name: "Salary",
      type: "income",
      amount: 4500,
      emoji: "💰",
      colorTag: "#22c55e",
    },
    {
      id: "2",
      name: "Rent",
      type: "expense",
      amount: 1200,
      emoji: "🏠",
      colorTag: "#ef4444",
    },
    {
      id: "3",
      name: "Utilities",
      type: "expense",
      amount: 300,
      emoji: "⚡",
      colorTag: "#f59e0b",
    },
    {
      id: "4",
      name: "Freelance",
      type: "income",
      amount: 1000,
      emoji: "💻",
      colorTag: "#3b82f6",
    },
  ],
};

const RecurringCashFlowSummaryCard = () => {
  const {
    totalMonthlyIncome,
    totalMonthlyExpenses,
    netMonthlyFlow,
    activeFlows,
    pausedFlows,
    upcomingThisWeek,
    topFlows,
  } = mockSummaryData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Net Flow Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Monthly Net Flow</span>
            <span
              className={`text-lg font-bold ${netMonthlyFlow >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {netMonthlyFlow >= 0 ? "+" : ""}₱
              {Math.abs(netMonthlyFlow).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-muted-foreground">Income</p>
                <p className="font-semibold text-green-600">
                  ₱{totalMonthlyIncome.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-muted-foreground">Expenses</p>
                <p className="font-semibold text-red-600">
                  ₱{totalMonthlyExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-muted-foreground text-sm">Active</p>
              <p className="font-semibold">{activeFlows}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-muted-foreground text-sm">This Week</p>
              <p className="font-semibold">{upcomingThisWeek}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Top Flows */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Top Cash Flows</h4>
          {topFlows.map((flow, index) => (
            <div key={flow.id}>
              {index > 0 && <Separator className="my-3" />}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{flow.emoji}</span>
                  <div>
                    <span className="text-sm font-medium">{flow.name}</span>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant={
                          flow.type === "income" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {flow.type === "income" ? "Income" : "Expense"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <span
                    className={`font-semibold ${flow.type === "income" ? "text-green-600" : "text-red-600"}`}
                  >
                    {flow.type === "income" ? "+" : "-"}₱
                    {flow.amount.toLocaleString()}
                  </span>
                  <p className="text-muted-foreground text-xs">monthly</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pausedFlows > 0 && (
          <>
            <Separator />
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                {pausedFlows} Paused Flow{pausedFlows > 1 ? "s" : ""}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecurringCashFlowSummaryCard;
