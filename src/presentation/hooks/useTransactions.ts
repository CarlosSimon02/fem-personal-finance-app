import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CreateTransactionDto,
  TransactionDto,
  UpdateTransactionDto,
} from "@/core/schemas/transactionSchema";
import { debugLog } from "@/utils/debugLog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createTransactionAction,
  deleteTransactionAction,
  getPaginatedTransactionsAction,
  updateTransactionAction,
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

  const queryKey = ["transactions", params];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getPaginatedTransactionsAction(params);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return query;
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

export const useUpdateTransaction = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<TransactionDto>) => {
  const updateTransactionMutation = useMutation({
    mutationFn: async ({
      transactionId,
      data,
    }: {
      transactionId: string;
      data: UpdateTransactionDto;
    }) => {
      try {
        const response = await updateTransactionAction({
          transactionId,
          data,
        });
        if (response.error) throw new Error(response.error);
        if (!response.data)
          throw new Error("No data returned from server action");

        return response.data;
      } catch (error) {
        console.error("Update transaction error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Transaction updated successfully!");
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error(`Update transaction failed: ${error.message}`);
      onError?.(error);
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  return updateTransactionMutation;
};

export const useDeleteTransaction = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<void>) => {
  const deleteTransactionMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      try {
        const response = await deleteTransactionAction({ transactionId });
        if (response.error) throw new Error(response.error);
        debugLog("useDeleteTransaction", "Transaction deleted");
        return;
      } catch (error) {
        console.error("Delete transaction error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Transaction deleted successfully!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Delete transaction failed: ${error.message}`);
      onError?.(error);
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  return deleteTransactionMutation;
};
