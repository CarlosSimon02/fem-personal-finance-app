import { budgetSchema } from "@/core/schemas/budgetSchema";
import { createPaginationResponseSchema } from "@/core/schemas/paginationSchema";
import { z } from "zod";
import { zTimestamp } from "./helpers";

export const budgetModelSchema = budgetSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
  });

export const budgetModelPaginationResponseSchema =
  createPaginationResponseSchema(budgetModelSchema);

export type BudgetModel = z.infer<typeof budgetModelSchema>;

export type BudgetModelPaginationResponse = z.infer<
  typeof budgetModelPaginationResponseSchema
>;

export type CreateBudgetModel = Omit<
  BudgetModel,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateBudgetModel = Partial<
  Omit<BudgetModel, "id" | "createdAt" | "updatedAt" | "userId">
>;
