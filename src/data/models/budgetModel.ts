import { budgetSchema } from "@/core/schemas/budgetSchema";
import { createPaginationResponseSchema } from "@/core/schemas/paginationSchema";
import { z } from "zod";
import { zFieldValue, zTimestamp } from "./helpers";

export const budgetModelSchema = budgetSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
  });

export const createBudgetModelSchema = budgetModelSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zFieldValue,
    updatedAt: zFieldValue,
  });

export const updateBudgetModelSchema = budgetModelSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    updatedAt: zFieldValue,
    createdAt: zFieldValue,
  })
  .partial();

export const budgetModelPaginationResponseSchema =
  createPaginationResponseSchema(budgetModelSchema);

export type BudgetModel = z.infer<typeof budgetModelSchema>;

export type BudgetModelPaginationResponse = z.infer<
  typeof budgetModelPaginationResponseSchema
>;

export type CreateBudgetModel = z.infer<typeof createBudgetModelSchema>;

export type UpdateBudgetModel = z.infer<typeof updateBudgetModelSchema>;
