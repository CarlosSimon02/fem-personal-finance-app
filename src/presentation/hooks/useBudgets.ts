import { BudgetDto, CreateBudgetDto } from "@/core/schemas/budgetSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBudgetAction } from "../actions/budgetActions";
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
