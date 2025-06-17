"use client";

import { Suspense } from "react";
import { useRecurringCashFlowPageParams } from "../_hooks/useRecurringCashFlowPageParams";
import RecurringCashFlowSearchFilterBar from "./RecurringCashFlowSearchFilterBar";
import RecurringCashFlowSkeleton from "./RecurringCashFlowSkeleton";
import RecurringCashFlowSummaryCard from "./RecurringCashFlowSummaryCard";
import RecurringCashFlowTable from "./RecurringCashFlowTable";

const RecurringCashFlowContainer = () => {
  const { search, type, status, sortBy, order, page } =
    useRecurringCashFlowPageParams();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left Side - Summary */}
      <div className="lg:sticky lg:top-6 lg:col-span-1">
        <RecurringCashFlowSummaryCard />
      </div>

      {/* Right Side - Search & Table */}
      <div className="space-y-6 lg:col-span-2">
        <RecurringCashFlowSearchFilterBar
          search={search}
          type={type}
          status={status}
          sortBy={sortBy}
          order={order}
        />

        <Suspense fallback={<RecurringCashFlowSkeleton />}>
          <RecurringCashFlowTable
            search={search}
            type={type}
            status={status}
            sortBy={sortBy}
            order={order}
            page={page}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default RecurringCashFlowContainer;
