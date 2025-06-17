"use client";

import { Suspense } from "react";
import { useRecurringCashFlowPageParams } from "../_hooks/useRecurringCashFlowPageParams";
import RecurringCashFlowSearchFilterBar from "./RecurringCashFlowSearchFilterBar";
import RecurringCashFlowSkeleton from "./RecurringCashFlowSkeleton";
import RecurringCashFlowTable from "./RecurringCashFlowTable";

const RecurringCashFlowContainer = () => {
  const { search, type, status, sortBy, order, page } =
    useRecurringCashFlowPageParams();

  return (
    <div>
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
