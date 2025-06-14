import {
  subscribeToIncomesUseCase,
  subscribeToTransactionsUseCase,
} from "@/factories/realtime";
import { revalidateIncomeTags } from "@/presentation/actions/incomeActions";
import { useAuth } from "@/presentation/contexts/AuthContext";
import {
  useIncomesSummary,
  useIncomesWithTransactions,
  UseIncomesWithTransactionsParams,
} from "@/presentation/hooks/useIncomes";
import { useEffect } from "react";

export const useIncomePageRealtime = ({
  sortBy = "createdAt",
  order = "desc",
  page = 1,
  pageSize = 10,
}: UseIncomesWithTransactionsParams) => {
  const { user } = useAuth();

  const incomeQuery = useIncomesWithTransactions({
    sortBy,
    order,
    page,
    pageSize,
  });

  const incomeSummaryQuery = useIncomesSummary();

  useEffect(() => {
    if (!user) return;

    const unsubscribers: (() => void)[] = [];

    const onRealtimeExecute = async () => {
      await revalidateIncomeTags();
      incomeQuery.refetch();
      incomeSummaryQuery.refetch();
    };

    unsubscribers.push(
      subscribeToIncomesUseCase.execute(user.id, onRealtimeExecute, (error) => {
        console.error("Real-time incomes error:", error);
      })
    );

    unsubscribers.push(
      subscribeToTransactionsUseCase.execute(
        user.id,
        onRealtimeExecute,
        (error) => {
          console.error("Real-time transactions error:", error);
        }
      )
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return {
    incomeQuery,
    incomeSummaryQuery,
  };
};
