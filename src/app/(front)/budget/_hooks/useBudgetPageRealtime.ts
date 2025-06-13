import {
  subscribeToBudgetsUseCase,
  subscribeToTransactionsUseCase,
} from "@/factories/realtime";
import { revalidateBudgetTags } from "@/presentation/actions/budgetActions";
import { useAuth } from "@/presentation/contexts/AuthContext";
import {
  useBudgetsSummary,
  useBudgetsWithTransactions,
  UseBudgetsWithTransactionsParams,
} from "@/presentation/hooks/useBudgets";
import { useEffect } from "react";

export const useBudgetPageRealtime = ({
  sortBy = "createdAt",
  order = "desc",
  page = 1,
  pageSize = 10,
}: UseBudgetsWithTransactionsParams) => {
  const { user } = useAuth();

  const budgetQuery = useBudgetsWithTransactions({
    sortBy,
    order,
    page,
    pageSize,
  });

  const budgetSummaryQuery = useBudgetsSummary();

  useEffect(() => {
    if (!user) return;

    const unsubscribers: (() => void)[] = [];

    const onRealtimeExecute = async () => {
      await revalidateBudgetTags();
      budgetQuery.refetch();
      budgetSummaryQuery.refetch();
    };

    unsubscribers.push(
      subscribeToBudgetsUseCase.execute(user.id, onRealtimeExecute, (error) => {
        console.error("Real-time budgets error:", error);
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
    budgetQuery,
    budgetSummaryQuery,
  };
};
