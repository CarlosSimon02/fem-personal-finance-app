import { nanoid } from "nanoid";
import { create } from "zustand";

type FilterByCategoryStore = {
  cacheUniq: string;
  setCacheUniq: () => void;
};

export const useFilterByCategory = create<FilterByCategoryStore>((set) => ({
  cacheUniq: "",
  setCacheUniq: () => {
    const uniqid = nanoid(10);
    set({ cacheUniq: uniqid });
  },
}));
