import {
  CreatePotDto,
  MoneyOperationInput,
  UpdatePotDto,
} from "@/core/schemas/potSchema";
import {
  addMoneyToPotAction,
  createPotAction,
  deletePotAction,
  updatePotAction,
  withdrawMoneyFromPotAction,
} from "@/presentation/actions/potActions";
import { useMutationWithToast } from "./shared/mutations";

interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreatePot = ({ onSuccess, onError }: MutationOptions = {}) => {
  return useMutationWithToast({
    mutationFn: async (data: CreatePotDto) => {
      const result = await createPotAction(data);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    successMessage: "Pot created successfully",
    errorMessage: "Failed to create pot",
    onSuccess,
    onError,
  });
};

export const useUpdatePot = ({ onSuccess, onError }: MutationOptions = {}) => {
  return useMutationWithToast({
    mutationFn: async (data: { id: string; data: UpdatePotDto }) => {
      const result = await updatePotAction(data);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    successMessage: "Pot updated successfully",
    errorMessage: "Failed to update pot",
    onSuccess,
    onError,
  });
};

export const useDeletePot = ({ onSuccess, onError }: MutationOptions = {}) => {
  return useMutationWithToast({
    mutationFn: async (id: string) => {
      const result = await deletePotAction(id);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    successMessage: "Pot deleted successfully",
    errorMessage: "Failed to delete pot",
    onSuccess,
    onError,
  });
};

export const useAddMoneyToPot = ({
  onSuccess,
  onError,
}: MutationOptions = {}) => {
  return useMutationWithToast({
    mutationFn: async (data: { id: string; data: MoneyOperationInput }) => {
      const result = await addMoneyToPotAction(data);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    successMessage: "Money added to pot successfully",
    errorMessage: "Failed to add money to pot",
    onSuccess,
    onError,
  });
};

export const useWithdrawMoneyFromPot = ({
  onSuccess,
  onError,
}: MutationOptions = {}) => {
  return useMutationWithToast({
    mutationFn: async (data: { id: string; data: MoneyOperationInput }) => {
      const result = await withdrawMoneyFromPotAction(data);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    successMessage: "Money withdrawn from pot successfully",
    errorMessage: "Failed to withdraw money from pot",
    onSuccess,
    onError,
  });
};
