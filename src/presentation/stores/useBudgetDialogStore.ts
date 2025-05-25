import { BudgetDto } from "@/core/schemas/budgetSchema";
import { create } from "zustand";

type BudgetDialogState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialData: Partial<BudgetDto> | null;
  setInitialData: (initialData: Partial<BudgetDto> | null) => void;
  callbackFn: (data: BudgetDto) => void;
  closeCallbackFn: () => void;
  getCallbackFn: () => (data: BudgetDto) => void;
  setCallbackFn: (callbackFn: (data: BudgetDto) => void) => void;
  setCloseCallbackFn: (closeCallbackFn: () => void) => void;
  getCloseCallbackFn: () => () => void;
};

export const useBudgetDialogStore = create<BudgetDialogState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  initialData: null,
  setInitialData: (initialData) => set({ initialData }),
  callbackFn: () => {},
  closeCallbackFn: () => {},
  getCallbackFn: () => () => {},
  setCallbackFn: (callbackFn) => set({ callbackFn }),
  setCloseCallbackFn: (closeCallbackFn) => set({ closeCallbackFn }),
  getCloseCallbackFn: () => () => {},
}));
