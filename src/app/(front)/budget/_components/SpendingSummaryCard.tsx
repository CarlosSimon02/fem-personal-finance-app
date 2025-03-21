import { BudgetChart } from "@/presentation/components/BudgetChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Separator } from "@/presentation/components/ui/separator";
import { getBudgetsData } from "../../overview/_data";

export async function SpendingSummaryCard() {
  const { budgets, totalSpent, totalLimit } = await getBudgetsData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <BudgetChart
            budgetData={budgets}
            totalLimit={totalLimit}
            totalSpent={totalSpent}
          />
        </div>

        <div className="space-y-4">
          {budgets.map((budget, index) => (
            <div key={budget.id}>
              {index > 0 && <Separator className="my-4" />}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-1 rounded-full"
                    style={{ backgroundColor: budget.color }}
                  />
                  <span className="font-medium">{budget.name}</span>
                </div>
                <div className="text-right text-sm">
                  <span>₱{budget.spent.toLocaleString()}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    of ₱{budget.limit.toLocaleString()}
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
