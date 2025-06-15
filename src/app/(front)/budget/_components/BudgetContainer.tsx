"use client";

import { Suspense } from "react";
import { useBudgetPageParams } from "../_hooks/useBudgetPageParams";
import { useBudgetPageRealtime } from "../_hooks/useBudgetPageRealtime";
import { BudgetCardsGrid } from "./BudgetCardsGrid";
import { BudgetsSkeleton } from "./BudgetsSkeleton";
import { SpendingSummaryCard } from "./SpendingSummaryCard";

const BudgetContainer = () => {
  const { page, pageSize } = useBudgetPageParams();

  useBudgetPageRealtime({
    page,
    pageSize,
  });

  return (
    <Suspense fallback={<BudgetsSkeleton />}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:sticky lg:col-span-1">
          <SpendingSummaryCard />
        </div>
        <div className="lg:col-span-2">
          <BudgetCardsGrid page={page} pageSize={pageSize} />
        </div>
      </div>
    </Suspense>
  );
};

export default BudgetContainer;
