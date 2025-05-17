import { z } from "zod";
import { validateOptionalHexColor } from "./helpers";

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
  userId: z.string().min(1, "User ID is required"),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export const budgetSchema = createBudgetSchema.extend({
  id: z.string().min(1, "Budget ID is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateBudgetDto = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetDto = z.infer<typeof updateBudgetSchema>;
export type BudgetDto = z.infer<typeof budgetSchema>;
