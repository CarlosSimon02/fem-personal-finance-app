import { Button } from "@/presentation/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Suspense } from "react";
import { EarningsSummaryCard } from "./_components/EarningsSummaryCard";
import { IncomeCardsGrid } from "./_components/IncomeCardsGrid";
import { IncomesSkeleton } from "./_components/IncomesSkeleton";

export default async function BudgetsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const paramsResult = await searchParams;
  const page = Number.parseInt(paramsResult.page || "1", 10);

  return (
    <div className="container space-y-6 py-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Income</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Income
        </Button>
      </div>

      <Suspense fallback={<IncomesSkeleton />}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:sticky lg:col-span-1">
            <EarningsSummaryCard />
          </div>
          <div className="lg:col-span-2">
            <IncomeCardsGrid page={page} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
