import { PaginationParams } from "@/core/schemas/paginationSchema";
import { useQuery } from "@tanstack/react-query";
import { getPaginatedTransactionsAction } from "../actions/transactionActions";

interface UseTransactionsParams {
  search?: string;
  category?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  pageSize?: number;
}

export const useTransactions = ({
  search = "",
  category = "",
  sortBy = "transactionDate",
  order = "desc",
  page = 1,
  pageSize = 10,
}: UseTransactionsParams) => {
  const params: PaginationParams = {
    search,
    filters:
      category && category !== "all"
        ? [
            {
              field: "category.name",
              operator: "==",
              value: category,
            },
          ]
        : [],
    sort: {
      field: sortBy,
      order: order as "asc" | "desc",
    },
    pagination: {
      page,
      limitPerPage: pageSize,
    },
  };

  return useQuery({
    queryKey: ["transactions", params],
    queryFn: async () => {
      const result = await getPaginatedTransactionsAction(params);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
