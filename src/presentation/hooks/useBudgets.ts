import { BudgetDto, CreateBudgetDto } from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { subscribeToBudgetsUseCase } from "@/factories/realtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  createBudgetAction,
  getPaginatedBudgetsAction,
} from "../actions/budgetActions";
import { useAuth } from "../contexts/AuthContext";
import { StatusCallbacksType } from "./types";

export const useCreateIncome = ({
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

export const useBudgetsRealtime = ({
  search = "",
  sortBy = "name",
  order = "asc",
  page = 1,
  pageSize = 10,
}: UseBudgetsParams) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const params: PaginationParams = {
    search,
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

  // Initialize React Query with initial fetch
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const result = await getPaginatedBudgetsAction(params);
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

    const unsubscribe = subscribeToBudgetsUseCase.execute(
      user.id,
      params,
      (budgets) => {
        // Create pagination metadata manually since onSnapshot doesn't provide it
        const totalItems = budgets.length;
        const totalPages = Math.ceil(
          totalItems / params.pagination.limitPerPage
        );

        const paginatedData = {
          data: budgets,
          meta: {
            pagination: {
              totalItems,
              page: params.pagination.page,
              limitPerPage: params.pagination.limitPerPage,
              nextPage:
                params.pagination.page < totalPages
                  ? params.pagination.page + 1
                  : null,
              previousPage:
                params.pagination.page > 1 ? params.pagination.page - 1 : null,
            },
            sort: params.sort,
            filters: params.filters,
            search: params.search,
          },
        };

        // Update React Query cache with real-time data
        queryClient.setQueryData(queryKey, paginatedData);
      },
      (error) => {
        console.error("Real-time budgets error:", error);
        // Set error state in React Query
        queryClient.setQueryData(queryKey, () => {
          throw error;
        });
      }
    );

    return unsubscribe;
  }, [user, JSON.stringify(params), queryClient, queryKey]);

  return query;
};
