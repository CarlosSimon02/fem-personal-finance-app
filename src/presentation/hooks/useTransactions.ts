import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CreateTransactionDto,
  TransactionDto,
} from "@/core/schemas/transactionSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createTransactionAction,
  getPaginatedTransactionsAction,
} from "../actions/transactionActions";
import { StatusCallbacksType } from "./types";

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

export const useCreateTransaction = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<TransactionDto>) => {
  const createTransactionMutation = useMutation({
    mutationFn: async (data: CreateTransactionDto) => {
      try {
        const response = await createTransactionAction(data);
        if (response.error) throw new Error(response.error);
        if (!response.data)
          throw new Error("No data returned from server action");

        return response.data;
      } catch (error) {
        console.error("Create transaction error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Transaction created successfully!");
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error(`Create transaction failed: ${error.message}`);
      onError?.(error);
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  return createTransactionMutation;
};
