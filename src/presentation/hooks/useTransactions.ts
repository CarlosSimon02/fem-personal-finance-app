import {
  CreateTransactionDto,
  TransactionDto,
  UpdateTransactionDto,
} from "@/core/schemas/transactionSchema";
import {
  createTransactionAction,
  deleteTransactionAction,
  getPaginatedTransactionsAction,
  updateTransactionAction,
} from "../actions/transactionActions";
import { useMutationWithToast } from "./shared/mutations";
import { createPaginationParams, useQueryWithDefaults } from "./shared/queries";
import { StatusCallbacksType } from "./types";

export interface UseTransactionsParams {
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
  const params = createPaginationParams({
    search,
    category,
    sortBy,
    order: order as "asc" | "desc",
    page,
    pageSize,
  });

  const queryKey = ["transactions", params];

  return useQueryWithDefaults({
    queryKey,
    queryFn: async () => {
      const result = await getPaginatedTransactionsAction(params);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};

export const useCreateTransaction = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<TransactionDto>) => {
  return useMutationWithToast({
    mutationFn: async (data: CreateTransactionDto) => {
      const response = await createTransactionAction(data);
      if (response.error) throw new Error(response.error);
      if (!response.data)
        throw new Error("No data returned from server action");
      return response.data;
    },
    successMessage: "Transaction created successfully!",
    errorMessage: "Create transaction failed",
    onSuccess,
    onError,
    onSettled,
  });
};

export const useUpdateTransaction = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<TransactionDto>) => {
  return useMutationWithToast({
    mutationFn: async ({
      transactionId,
      data,
    }: {
      transactionId: string;
      data: UpdateTransactionDto;
    }) => {
      const response = await updateTransactionAction({ transactionId, data });
      if (response.error) throw new Error(response.error);
      if (!response.data)
        throw new Error("No data returned from server action");
      return response.data;
    },
    successMessage: "Transaction updated successfully!",
    errorMessage: "Update transaction failed",
    onSuccess,
    onError,
    onSettled,
  });
};

export const useDeleteTransaction = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<void>) => {
  return useMutationWithToast({
    mutationFn: async (transactionId: string): Promise<void> => {
      const response = await deleteTransactionAction({ transactionId });
      if (response.error) throw new Error(response.error);
      return;
    },
    successMessage: "Transaction deleted successfully!",
    errorMessage: "Delete transaction failed",
    onSuccess,
    onError,
    onSettled,
  });
};
