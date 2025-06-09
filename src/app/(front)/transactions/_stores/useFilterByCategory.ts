import { generateId } from "@/utils/generateId";
import { create } from "zustand";

type FilterByCategoryStore = {
  cacheUniq: string;
  setCacheUniq: () => void;
};

export const useFilterByCategory = create<FilterByCategoryStore>((set) => ({
  cacheUniq: "",
  setCacheUniq: () => {
    const uniqid = generateId(10);
    set({ cacheUniq: uniqid });
  },
}));
