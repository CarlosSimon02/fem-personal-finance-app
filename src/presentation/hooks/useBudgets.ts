import { BudgetDto, CreateBudgetDto } from "@/core/schemas/budgetSchema";
import {
  createBudgetAction,
  getBudgetsSummaryAction,
  getPaginatedBudgetsWithTransactionsAction,
} from "../actions/budgetActions";
import { useAuth } from "../contexts/AuthContext";
import { useMutationWithToast } from "./shared/mutations";
import {
  createPaginationParams,
  createQueryKey,
  useQueryWithDefaults,
} from "./shared/queries";
import { StatusCallbacksType } from "./types";

export const useCreateBudget = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<BudgetDto>) => {
  return useMutationWithToast({
    mutationFn: async (data: CreateBudgetDto) => {
      const response = await createBudgetAction(data);
      if (response.error) throw new Error(response.error);
      if (!response.data)
        throw new Error("No data returned from server action");
      return response.data;
    },
    successMessage: "Budget created successfully!",
    errorMessage: "Create budget failed",
    onSuccess,
    onError,
    onSettled,
  });
};

interface UseBudgetsParams {
  search?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  pageSize?: number;
}

export const useBudgetsWithTransactions = ({
  sortBy = "createdAt",
  order = "desc",
  page = 1,
  pageSize = 4,
}: UseBudgetsParams) => {
  const { user } = useAuth();

  const params = createPaginationParams({
    search: "",
    sortBy,
    order: order as "asc" | "desc",
    page,
    pageSize,
  });

  const queryKey = createQueryKey("budgets", params);

  return useQueryWithDefaults({
    queryKey,
    queryFn: async () => {
      const result = await getPaginatedBudgetsWithTransactionsAction(params);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};

export const useBudgetsSummary = () => {
  const queryKey = createQueryKey("budget-summary");

  return useQueryWithDefaults({
    queryKey,
    queryFn: async () => {
      const result = await getBudgetsSummaryAction(undefined);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};
