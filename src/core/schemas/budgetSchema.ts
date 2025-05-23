import { z } from "zod";
import { validateOptionalHexColor } from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";

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

export const paginatedBudgetsResponseSchema =
  createPaginationResponseSchema(budgetSchema);

export type CreateBudgetDto = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetDto = z.infer<typeof updateBudgetSchema>;
export type BudgetDto = z.infer<typeof budgetSchema>;
export type PaginatedBudgetsResponse = z.infer<
  typeof paginatedBudgetsResponseSchema
>;
