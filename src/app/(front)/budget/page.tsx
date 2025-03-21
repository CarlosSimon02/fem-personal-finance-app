import { Button } from "@/presentation/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Suspense } from "react";
import { BudgetCardsGrid } from "./_components/BudgetCardsGrid";
import { BudgetsSkeleton } from "./_components/BudgetsSkeleton";
import { SpendingSummaryCard } from "./_components/SpendingSummaryCard";

export default function BudgetsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
  };
}) {
  const page = Number.parseInt(searchParams.page || "1", 10);

  return (
    <div className="container space-y-6 py-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Budget
        </Button>
      </div>

      <Suspense fallback={<BudgetsSkeleton />}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:sticky lg:col-span-1">
            <SpendingSummaryCard />
          </div>
          <div className="lg:col-span-2">
            <BudgetCardsGrid page={page} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
