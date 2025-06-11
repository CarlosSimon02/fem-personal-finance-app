import { CreateIncomeDto, IncomeDto } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPaginatedBudgetsWithTransactionsAction } from "../actions/budgetActions";
import {
  createIncomeAction,
  getIncomesSummaryAction,
} from "../actions/incomeActions";
import { StatusCallbacksType } from "./types";

export const useCreateIncome = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<IncomeDto>) => {
  const createIncomeMutation = useMutation({
    mutationFn: async (data: CreateIncomeDto) => {
      try {
        const response = await createIncomeAction(data);
        if (response.error) throw new Error(response.error);
        if (!response.data)
          throw new Error("No data returned from server action");
        return response.data;
      } catch (error) {
        console.error("Create income error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Income created successfully!");
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error(`Create income failed: ${error.message}`);
      onError?.(error);
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  return createIncomeMutation;
};

interface UseIncomesParams {
  search?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  pageSize?: number;
}

export const useIncomesWithTransactions = ({
  sortBy = "createdAt",
  order = "desc",
  page = 1,
  pageSize = 4,
}: UseIncomesParams) => {
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

  const queryKey = ["incomes", params];

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

export const useIncomesSummary = () => {
  const queryKey = ["income-summary"];
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getIncomesSummaryAction(undefined);
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
