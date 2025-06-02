import { CreateIncomeDto, IncomeDto } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { subscribeToIncomesUseCase } from "@/factories/realtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  createIncomeAction,
  getPaginatedIncomesAction,
} from "../actions/incomeActions";
import { useAuth } from "../contexts/AuthContext";
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

export const useIncomesRealtime = ({
  search = "",
  sortBy = "name",
  order = "asc",
  page = 1,
  pageSize = 10,
}: UseIncomesParams) => {
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

  const queryKey = ["incomes", params];

  // Initialize React Query with initial fetch
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const result = await getPaginatedIncomesAction(params);
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

    const unsubscribe = subscribeToIncomesUseCase.execute(
      user.id,
      params,
      (incomes) => {
        // Create pagination metadata manually since onSnapshot doesn't provide it
        const totalItems = incomes.length;
        const totalPages = Math.ceil(
          totalItems / params.pagination.limitPerPage
        );

        const paginatedData = {
          data: incomes,
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
        console.error("Real-time incomes error:", error);
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
