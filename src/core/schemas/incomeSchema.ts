import { z } from "zod";
import { validateOptionalHexColor } from "./helpers";

export const createIncomeSchema = z.object({
  name: z
    .string()
    .min(1, "Budget name is required")
    .max(50, "Budget name must be less than 50 characters"),
  colorTag: z.string().refine(validateOptionalHexColor, {
    message: "Color tag must be a valid hex color code (e.g., #FF5733)",
  }),
});

export const updateIncomeSchema = createIncomeSchema.partial();

export const incomeSchema = createIncomeSchema.extend({
  id: z.string().min(1, "Income ID is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateIncomeDto = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeDto = z.infer<typeof updateIncomeSchema>;
export type IncomeDto = z.infer<typeof incomeSchema>;
