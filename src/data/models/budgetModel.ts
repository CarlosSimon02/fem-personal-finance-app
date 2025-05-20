import { Timestamp } from "firebase-admin/firestore";

export type BudgetModel = {
  id: string;
  name: string;
  maximumSpending: number;
  colorTag: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type CreateBudgetModel = Omit<
  BudgetModel,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateBudgetModel = Partial<
  Omit<BudgetModel, "id" | "createdAt" | "updatedAt" | "userId">
>;
