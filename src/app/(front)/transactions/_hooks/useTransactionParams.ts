import { useSearchParams } from "next/navigation";
import { TransactionPageParams } from "../_types/TransactionPageParams";

export const useTransactionPageParams = (): TransactionPageParams => {
  const searchParams = useSearchParams();

  return {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    sortBy: searchParams.get("sortBy") || "transactionDate",
    order: searchParams.get("order") || "desc",
    page: Number.parseInt(searchParams.get("page") || "1", 10),
  };
};
