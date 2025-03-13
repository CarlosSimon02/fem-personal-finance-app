import { z } from "zod";

// Helper function to validate hex color codes
const isValidHexColor = (color: string) => /^#[0-9A-F]{6}$/i.test(color);

export const createBudgetSchema = z.object({
  name: z
    .string()
    .min(1, "Budget name is required")
    .max(50, "Budget name must be less than 50 characters"),
  maximumSpending: z
    .number()
    .positive("Maximum spending must be greater than 0")
    .finite("Maximum spending must be a finite number"),
  colorTag: z.string().refine(isValidHexColor, {
    message: "Color tag must be a valid hex color code (e.g., #FF5733)",
  }),
  userId: z.string().min(1, "User ID is required"),
});

export const updateBudgetSchema = createBudgetSchema
  .partial()
  .omit({ userId: true });

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
