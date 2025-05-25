import { IncomeDto } from "@/core/schemas/incomeSchema";
import { create } from "zustand";

type IncomeDialogState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialData: Partial<IncomeDto> | null;
  setInitialData: (initialData: Partial<IncomeDto> | null) => void;
  callbackFn: (data: IncomeDto) => void;
  closeCallbackFn: () => void;
  getCallbackFn: () => (data: IncomeDto) => void;
  setCallbackFn: (callbackFn: (data: IncomeDto) => void) => void;
  setCloseCallbackFn: (closeCallbackFn: () => void) => void;
  getCloseCallbackFn: () => () => void;
};

export const useIncomeDialogStore = create<IncomeDialogState>((set) => ({
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
