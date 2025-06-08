import { z } from "zod";
import { validateOptionalHexColor } from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";
import { transactionSchema } from "./transactionSchema";

export const createIncomeSchema = z.object({
  name: z
    .string()
    .min(1, "Income name is required")
    .max(50, "Income name must be less than 50 characters"),
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

export const incomeWithTransactionsSchema = incomeSchema.extend({
  transactions: z.array(transactionSchema),
});

export const paginatedIncomesResponseSchema =
  createPaginationResponseSchema(incomeSchema);

export const paginatedIncomesWithTransactionsResponseSchema =
  createPaginationResponseSchema(incomeWithTransactionsSchema);

export type CreateIncomeDto = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeDto = z.infer<typeof updateIncomeSchema>;
export type IncomeDto = z.infer<typeof incomeSchema>;
export type PaginatedIncomesResponse = z.infer<
  typeof paginatedIncomesResponseSchema
>;
export type PaginatedIncomesWithTransactionsResponse = z.infer<
  typeof paginatedIncomesWithTransactionsResponseSchema
>;
