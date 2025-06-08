import { z } from "zod";
import { validateOptionalHexColor } from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";
import { transactionSchema } from "./transactionSchema";

export const createBudgetSchema = z.object({
  name: z
    .string()
    .min(1, "Budget name is required")
    .max(50, "Budget name must be less than 50 characters"),
  maximumSpending: z
    .number()
    .positive("Maximum spending must be greater than 0")
    .finite("Maximum spending must be a finite number"),
  colorTag: z.string().refine(validateOptionalHexColor, {
    message: "Color tag must be a valid hex color code (e.g., #FF5733)",
  }),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export const budgetSchema = createBudgetSchema.extend({
  id: z.string().min(1, "Budget ID is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const budgetWithTransactionsSchema = budgetSchema.extend({
  transactions: z.array(transactionSchema),
  spent: z.number().min(0, "Spent cannot be negative"),
});

export const paginatedBudgetsResponseSchema =
  createPaginationResponseSchema(budgetSchema);

export const paginatedBudgetsWithTransactionsResponseSchema =
  createPaginationResponseSchema(budgetWithTransactionsSchema);

export const budgetsSummarySchema = z.object({
  totalAmountOfBudgets: z.number().int().positive(),
  totalAmountSpent: z.number().int().positive(),
  totalCountOfBudgets: z.number().int().positive(),
  budgets: z.array(budgetSchema),
});

export type CreateBudgetDto = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetDto = z.infer<typeof updateBudgetSchema>;
export type BudgetDto = z.infer<typeof budgetSchema>;
export type BudgetWithTransactionsDto = z.infer<
  typeof budgetWithTransactionsSchema
>;
export type PaginatedBudgetsResponseDto = z.infer<
  typeof paginatedBudgetsResponseSchema
>;
export type PaginatedBudgetsWithTransactionsResponseDto = z.infer<
  typeof paginatedBudgetsWithTransactionsResponseSchema
>;
export type BudgetsSummaryDto = z.infer<typeof budgetsSummarySchema>;
