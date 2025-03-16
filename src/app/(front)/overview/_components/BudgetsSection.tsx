import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import Link from "next/link";
import { getBudgetsData } from "../_data";
import { BudgetChart } from "./BudgetChart";

export async function BudgetsSection() {
  const { totalSpent, totalLimit, topBudgets } = await getBudgetsData();

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Budgets</CardTitle>
        </div>
        <Link href="/budgets" className="text-primary text-sm hover:underline">
          See Details
        </Link>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="flex gap-4 max-md:flex-col">
          <div className="flex flex-col items-center justify-center">
            <BudgetChart
              budgetData={topBudgets}
              totalSpent={totalSpent}
              totalLimit={totalLimit}
            />
          </div>
          <div className="space-y-4">
            {topBudgets.map((budget) => (
              <div key={budget.id} className="flex items-center space-x-4">
                <div
                  className="h-12 w-1 rounded-full"
                  style={{ backgroundColor: budget.color }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{budget.name}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    ₱{budget.spent.toLocaleString()} / ₱
                    {budget.limit.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
