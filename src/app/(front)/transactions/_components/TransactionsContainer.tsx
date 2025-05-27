"use client";

import { useSearchParams } from "next/navigation";
import { SearchFilterBar } from "./SearchFilterBar";
import { TransactionsTable } from "./TransactionsTable";

export function TransactionsContainer() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "transactionDate";
  const order = searchParams.get("order") || "desc";
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  return (
    <>
      <SearchFilterBar
        search={search}
        category={category}
        sortBy={sortBy}
        order={order}
      />

      <TransactionsTable
        search={search}
        category={category}
        sortBy={sortBy}
        order={order}
        page={page}
      />
    </>
  );
}
