"use client";

import { useBudgetPageParams } from "../_hooks/useBudgetPageParams";
import { useBudgetPageRealtime } from "../_hooks/useBudgetPageRealtime";
import { BudgetCardsGrid } from "./BudgetCardsGrid";
import { SpendingSummaryCard } from "./SpendingSummaryCard";

const BudgetContainer = () => {
  const { page, pageSize } = useBudgetPageParams();

  useBudgetPageRealtime({
    page,
    pageSize,
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:sticky lg:col-span-1">
        <SpendingSummaryCard />
      </div>
      <div className="lg:col-span-2">
        <BudgetCardsGrid page={page} pageSize={pageSize} />
      </div>
    </div>
  );
};

export default BudgetContainer;
