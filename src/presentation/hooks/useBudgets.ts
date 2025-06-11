import { BudgetDto, CreateBudgetDto } from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBudgetAction,
  getBudgetsSummaryAction,
  getPaginatedBudgetsWithTransactionsAction,
} from "../actions/budgetActions";
import { useAuth } from "../contexts/AuthContext";
import { StatusCallbacksType } from "./types";

export const useCreateBudget = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<BudgetDto>) => {
  const createBudgetMutation = useMutation({
    mutationFn: async (data: CreateBudgetDto) => {
      try {
        const response = await createBudgetAction(data);
        if (response.error) throw new Error(response.error);
        if (!response.data)
          throw new Error("No data returned from server action");
        return response.data;
      } catch (error) {
        console.error("Create budget error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Budget created successfully!");
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error(`Create budget failed: ${error.message}`);
      onError?.(error);
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  return createBudgetMutation;
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
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const params: PaginationParams = {
    search: "",
    filters: [],
    sort: {
      field: sortBy,
      order: order as "asc" | "desc",
    },
    pagination: {
      page,
      limitPerPage: pageSize,
    },
  };

  const queryKey = ["budgets", params];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getPaginatedBudgetsWithTransactionsAction(params);
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

export const useBudgetsSummary = () => {
  const query = useQuery({
    queryKey: ["budget-summary"],
    queryFn: async () => {
      const result = await getBudgetsSummaryAction(undefined);
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
