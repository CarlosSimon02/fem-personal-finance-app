"use client";

import { BudgetChart } from "@/presentation/components/BudgetChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Separator } from "@/presentation/components/ui/separator";
import { useBudgetsSummary } from "@/presentation/hooks/useBudgets";
import { SpendingSummaryCardSkeleton } from "./BudgetsSkeleton";

export function SpendingSummaryCard() {
  const { data: budgetsSummary, isLoading, isError } = useBudgetsSummary();

  if (isLoading) return <SpendingSummaryCardSkeleton />;

  if (isError) return <div>Error loading budgets summary</div>;

  if (!budgetsSummary) return <div>No budgets summary</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <BudgetChart
            budgetData={budgetsSummary.budgets.map((budget) => ({
              name: budget.name,
              spent: budget.maximumSpending,
              limit: budget.maximumSpending,
              color: budget.colorTag,
            }))}
            totalLimit={budgetsSummary.totalAmountOfBudgets}
            totalSpent={budgetsSummary.totalAmountSpent}
          />
        </div>

        <div className="space-y-4">
          {budgetsSummary.budgets.map((budget, index) => (
            <div key={budget.id}>
              {index > 0 && <Separator className="my-4" />}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-1 rounded-full"
                    style={{ backgroundColor: budget.colorTag }}
                  />
                  <span className="font-medium">{budget.name}</span>
                </div>
                <div className="text-right text-sm">
                  <span>₱{budget.maximumSpending.toLocaleString()}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    of ₱{budget.maximumSpending.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
