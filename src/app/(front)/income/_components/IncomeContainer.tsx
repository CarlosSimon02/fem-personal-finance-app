"use client";

import { useIncomePageParams } from "../_hooks/useIncomePageParams";
import { useIncomePageRealtime } from "../_hooks/useIncomePageRealtime";
import { EarningsSummaryCard } from "./EarningSummaryCard";
import { IncomeCardsGrid } from "./IncomeCardsGrid";

const IncomeContainer = () => {
  const { page, pageSize } = useIncomePageParams();

  useIncomePageRealtime({
    page,
    pageSize,
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:sticky lg:col-span-1">
        <EarningsSummaryCard />
      </div>
      <div className="lg:col-span-2">
        <IncomeCardsGrid page={page} pageSize={pageSize} />
      </div>
    </div>
  );
};

export default IncomeContainer;
