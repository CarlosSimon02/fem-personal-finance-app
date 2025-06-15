"use client";

import { useTransactionPageRealtime } from "@/app/(front)/transactions/_hooks/useTransactionPageRealtime";
import { Suspense } from "react";
import { useTransactionPageParams } from "../_hooks/useTransactionParams";
import { SearchFilterBar } from "./SearchFilterBar";
import { TransactionsSkeleton } from "./TransactionsSkeleton";
import TransactionsTable from "./TransactionsTable";

export function TransactionsContainer() {
  const { search, category, sortBy, order, page } = useTransactionPageParams();

  useTransactionPageRealtime({
    search,
    category,
    sortBy,
    order,
    page,
  });

  return (
    <>
      <SearchFilterBar
        search={search}
        category={category}
        sortBy={sortBy}
        order={order}
      />

      <Suspense fallback={<TransactionsSkeleton />}>
        <TransactionsTable
          search={search}
          category={category}
          sortBy={sortBy}
          order={order}
          page={page}
        />
      </Suspense>
    </>
  );
}
