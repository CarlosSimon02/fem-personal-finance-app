import { useFilterByCategory } from "@/app/(front)/transactions/_stores/useFilterByCategory";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CreateTransactionDto,
  TransactionDto,
  UpdateTransactionDto,
} from "@/core/schemas/transactionSchema";
import { subscribeToTransactionsUseCase } from "@/factories/realtime";
import { debugLog } from "@/utils/debugLog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  createTransactionAction,
  deleteTransactionAction,
  getPaginatedTransactionsAction,
  revalidateTransactionTags,
  updateTransactionAction,
} from "../actions/transactionActions";
import { useAuth } from "../contexts/AuthContext";
import { StatusCallbacksType } from "./types";

interface UseTransactionsParams {
  search?: string;
  category?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  pageSize?: number;
}

export const useTransactionsRealtime = ({
  search = "",
  category = "",
  sortBy = "transactionDate",
  order = "desc",
  page = 1,
  pageSize = 10,
}: UseTransactionsParams) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { setCacheUniq } = useFilterByCategory();

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

  // Initialize React Query with initial fetch
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getPaginatedTransactionsAction(params);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Data is always fresh from onSnapshot
  });

  // Set up real-time listener
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToTransactionsUseCase.execute(
      user.id,
      async (_) => {
        await revalidateTransactionTags();
        const response = await getPaginatedTransactionsAction(params);

        if (response.error) {
          throw new Error(response.error);
        }

        debugLog("useTransactionsRealtime", "Transaction updated");
        queryClient.setQueryData(queryKey, response.data);
        setCacheUniq();
      },
      (error) => {
        console.error("Real-time transactions error:", error);
        // Set error state in React Query
        queryClient.setQueryData(queryKey, () => {
          throw error;
        });
      }
    );

    return unsubscribe;
  }, []);

  return query;
};

export const useCreateTransaction = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<TransactionDto>) => {
  const queryClient = useQueryClient();

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
      // Invalidate all transaction queries to trigger refetch/realtime update
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
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
  const queryClient = useQueryClient();

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
      // Invalidate all transaction queries to trigger refetch/realtime update
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
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
  const queryClient = useQueryClient();

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
      // Invalidate all transaction queries to trigger refetch/realtime update
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
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
