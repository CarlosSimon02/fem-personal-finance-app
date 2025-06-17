"use client";

import { useSearchParams } from "next/navigation";

export const useRecurringCashFlowPageParams = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  return {
    search,
    type,
    status,
    sortBy,
    order,
    page,
  };
};
