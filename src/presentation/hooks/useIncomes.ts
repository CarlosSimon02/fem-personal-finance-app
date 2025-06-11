import {
  CreateIncomeDto,
  IncomeDto,
  UpdateIncomeDto,
} from "@/core/schemas/incomeSchema";
import {
  createIncomeAction,
  deleteIncomeAction,
  getIncomesSummaryAction,
  getPaginatedIncomesWithTransactionsAction,
  updateIncomeAction,
} from "../actions/incomeActions";
import { useMutationWithToast } from "./shared/mutations";
import {
  createPaginationParams,
  createQueryKey,
  useQueryWithDefaults,
} from "./shared/queries";
import { StatusCallbacksType } from "./types";

export const useCreateIncome = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<IncomeDto>) => {
  return useMutationWithToast({
    mutationFn: async (data: CreateIncomeDto) => {
      const response = await createIncomeAction(data);
      if (response.error) throw new Error(response.error);
      if (!response.data)
        throw new Error("No data returned from server action");
      return response.data;
    },
    successMessage: "Income created successfully!",
    errorMessage: "Create income failed",
    onSuccess,
    onError,
    onSettled,
  });
};

export const useDeleteIncome = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<void>) => {
  return useMutationWithToast({
    mutationFn: async (data: string) => {
      const response = await deleteIncomeAction(data);
      if (response.error) throw new Error(response.error);
      if (!response.data)
        throw new Error("No data returned from server action");
      return response.data;
    },
    successMessage: "Income deleted successfully!",
    errorMessage: "Delete income failed",
    onSuccess,
    onError,
    onSettled,
  });
};

export const useUpdateIncome = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<IncomeDto>) => {
  return useMutationWithToast({
    mutationFn: async (data: { id: string; data: UpdateIncomeDto }) => {
      const response = await updateIncomeAction(data);
      if (response.error) throw new Error(response.error);
      if (!response.data)
        throw new Error("No data returned from server action");
      return response.data;
    },
    successMessage: "Income updated successfully!",
    errorMessage: "Update income failed",
    onSuccess,
    onError,
    onSettled,
  });
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
  const params = createPaginationParams({
    search: "",
    sortBy,
    order: order as "asc" | "desc",
    page,
    pageSize,
  });

  const queryKey = createQueryKey("incomes", params);

  return useQueryWithDefaults({
    queryKey,
    queryFn: async () => {
      const result = await getPaginatedIncomesWithTransactionsAction(params);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};

export const useIncomesSummary = () => {
  const queryKey = createQueryKey("income-summary");

  return useQueryWithDefaults({
    queryKey,
    queryFn: async () => {
      const result = await getIncomesSummaryAction(undefined);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};
