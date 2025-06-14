"use client";

import { IncomeChart } from "@/presentation/components/IncomeChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Separator } from "@/presentation/components/ui/separator";
import { useIncomesSummary } from "@/presentation/hooks/useIncomes";
import { EarningsSummaryCardSkeleton } from "./IncomesSkeleton";

export function EarningsSummaryCard() {
  const { data: incomesSummary, isLoading, isError } = useIncomesSummary();

  if (isLoading) return <EarningsSummaryCardSkeleton />;

  if (isError) return <div>Error loading incomes summary</div>;

  if (!incomesSummary) return <div>No incomes summary</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <IncomeChart
            incomeData={incomesSummary.incomes.map((income) => ({
              name: income.name,
              earned: Math.abs(income.totalEarned),
              color: income.colorTag,
            }))}
            totalEarned={Math.abs(incomesSummary.totalEarned)}
          />
        </div>

        <div className="space-y-4">
          {incomesSummary.incomes.map((income, index) => (
            <div key={income.id}>
              {index > 0 && <Separator className="my-4" />}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-1 rounded-full"
                    style={{ backgroundColor: income.colorTag }}
                  />
                  <span className="font-medium">{income.name}</span>
                </div>
                <div className="text-right text-sm">
                  <span>₱{Math.abs(income.totalEarned).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
