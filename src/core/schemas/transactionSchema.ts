import { z } from "zod";
import { validateOptionalHexColor } from "./helpers";

export const transactionCategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Category name is required"),
  color: z.string().nullable().refine(validateOptionalHexColor, {
    message: "Color must be a valid hex color code (e.g., #FF5733) or null",
  }),
});

export const createTransactionSchema = z.object({
  name: z
    .string()
    .min(1, "Transaction name is required")
    .max(100, "Transaction name must be less than 100 characters"),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: 'Type must be either "income" or "expense"' }),
  }),
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .finite("Amount must be a finite number"),
  recipientOrPayer: z.string().nullable(),
  category: transactionCategorySchema,
  transactionDate: z.instanceof(Date, {
    message: "Transaction date must be a valid date",
  }),
  description: z.string().nullable(),
  userId: z.string().min(1, "User ID is required"),
});

export const updateTransactionSchema = createTransactionSchema
  .partial()
  .omit({ userId: true });

export const paginationParamsSchema = z.object({
  limit: z.number().int().positive().default(10),
  cursor: z.string().nullable().default(null),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type PaginationParams = z.infer<typeof paginationParamsSchema>;
