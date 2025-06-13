import {
  subscribeToCategoriesUseCase,
  subscribeToTransactionsUseCase,
} from "@/factories/realtime";
import {
  revalidateCategoryTag,
  revalidateTransactionTag,
} from "@/presentation/actions/transactionActions";
import { useAuth } from "@/presentation/contexts/AuthContext";
import {
  useTransactions,
  UseTransactionsParams,
} from "@/presentation/hooks/useTransactions";
import { useEffect } from "react";
import { useFilterByCategory } from "../_stores/useFilterByCategory";

export const useTransactionPageRealtime = ({
  search = "",
  category = "",
  sortBy = "transactionDate",
  order = "desc",
  page = 1,
  pageSize = 10,
}: UseTransactionsParams) => {
  const { user } = useAuth();
  const { setCacheUniq } = useFilterByCategory();

  // Get the standard query result
  const transactionsQuery = useTransactions({
    search,
    category,
    sortBy,
    order,
    page,
    pageSize,
  });

  useEffect(() => {
    if (!user) return;

    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      subscribeToTransactionsUseCase.execute(
        user.id,
        async (_) => {
          await revalidateTransactionTag();
          transactionsQuery.refetch();
        },
        (error) => {
          console.error("Real-time transactions error:", error);
        }
      )
    );

    unsubscribers.push(
      subscribeToCategoriesUseCase.execute(
        user.id,
        async (_) => {
          await revalidateCategoryTag();
          setCacheUniq();
        },
        (error) => {
          console.error("Real-time categories error:", error);
        }
      )
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return transactionsQuery;
};
