import { budgetSchema } from "@/core/schemas/budgetSchema";
import { z } from "zod";
import { zTimestamp } from "./_utils";

export const budgetModelSchema = budgetSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
  });

export type BudgetModel = z.infer<typeof budgetModelSchema>;

export type CreateBudgetModel = Omit<
  BudgetModel,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateBudgetModel = Partial<
  Omit<BudgetModel, "id" | "createdAt" | "updatedAt" | "userId">
>;
