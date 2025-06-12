import { TransactionDto } from "@/core/schemas/transactionSchema";
import { useAuth } from "@/presentation/contexts/AuthContext";
import {
  createPaginationParams,
  createQueryKey,
} from "@/presentation/hooks/shared/queries";
import { useTransactions } from "@/presentation/hooks/useTransactions";
import { RealtimeListenerService } from "@/presentation/services/realtimeListenerService";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface UseTransactionPageRealtimeParams {
  search?: string;
  category?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  pageSize?: number;
}

export const useTransactionPageRealtime = ({
  search = "",
  category = "",
  sortBy = "transactionDate",
  order = "desc",
  page = 1,
  pageSize = 10,
}: UseTransactionPageRealtimeParams) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get the standard query result
  const transactionsQuery = useTransactions({
    search,
    category,
    sortBy,
    order,
    page,
    pageSize,
  });

  const params = createPaginationParams({
    search,
    category,
    sortBy,
    order: order as "asc" | "desc",
    page,
    pageSize,
  });

  const queryKey = createQueryKey("transactions", params);

  useEffect(() => {
    if (!user?.id) return;

    const realtimeService = RealtimeListenerService.getInstance();

    const cleanup = realtimeService.subscribe<TransactionDto>({
      userId: user.id,
      entityType: "transactions",
      onData: (realtimeData) => {
        // Update React Query cache with real-time data
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData) return oldData;

          // Replace the items array with real-time data
          // Keep pagination metadata intact
          return {
            ...oldData,
            items: realtimeData,
            // Update timestamp to indicate fresh data
            lastUpdated: new Date().toISOString(),
          };
        });
      },
      onError: (error) => {
        console.error("Real-time transactions error:", error);
        // Optionally invalidate query to trigger refetch
        queryClient.invalidateQueries({ queryKey });
      },
    });

    return cleanup;
  }, [user?.id, queryClient, queryKey]);

  return transactionsQuery;
};
