import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export type MutationConfig<TData, TVariables, TError = Error> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: () => void;
};

export const useMutationWithToast = <TData, TVariables, TError = Error>({
  mutationFn,
  successMessage,
  errorMessage,
  onSuccess,
  onError,
  onSettled,
}: MutationConfig<TData, TVariables, TError>) => {
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (successMessage) {
        toast.success(successMessage);
      }
      onSuccess?.(data);
    },
    onError: (error: TError) => {
      const message = errorMessage
        ? `${errorMessage}: ${error instanceof Error ? error.message : "Unknown error"}`
        : error instanceof Error
          ? error.message
          : "An error occurred";
      toast.error(message);
      onError?.(error);
    },
    onSettled,
  } as UseMutationOptions<TData, TError, TVariables>);
};

export const createServerActionMutation = <TData, TVariables>(
  actionFn: (
    variables: TVariables
  ) => Promise<{ data?: TData; error?: string }>,
  operationName: string
) => {
  return async (variables: TVariables): Promise<TData> => {
    try {
      const response = await actionFn(variables);
      if (response.error) throw new Error(response.error);
      if (!response.data)
        throw new Error("No data returned from server action");
      return response.data;
    } catch (error) {
      console.error(`${operationName} error:`, error);
      throw error;
    }
  };
};
