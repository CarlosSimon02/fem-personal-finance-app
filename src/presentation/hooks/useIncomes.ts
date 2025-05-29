import { CreateIncomeDto, IncomeDto } from "@/core/schemas/incomeSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createIncomeAction } from "../actions/incomeActions";
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
