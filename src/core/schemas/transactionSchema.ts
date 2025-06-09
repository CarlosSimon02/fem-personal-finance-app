import { z } from "zod";
import { isValidEmoji, validateOptionalHexColor } from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";

export const transactionCategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Category name is required"),
  colorTag: z.string().refine(validateOptionalHexColor, {
    message: "Color must be a valid hex color code (e.g., #FF5733) or null",
  }),
});

export const transactionTypeSchema = z.enum(["income", "expense"], {
  errorMap: () => ({ message: 'Type must be either "income" or "expense"' }),
});

const baseTransactionSchema = z.object({
  name: z
    .string()
    .min(1, "Transaction name is required")
    .max(100, "Transaction name must be less than 100 characters"),
  type: transactionTypeSchema,
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .finite("Amount must be a finite number")
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val.toString()),
      "Amount must have at most 2 decimal places"
    ),
  recipientOrPayer: z.string().nullable(),
  transactionDate: z.instanceof(Date, {
    message: "Transaction date must be a valid date",
  }),
  description: z.string().nullable(),
  emoji: z.string().refine(isValidEmoji, {
    message: "Only emoji characters are allowed",
  }),
});

export const createTransactionSchema = baseTransactionSchema.extend({
  categoryId: z.string().min(1, "Category ID is required"),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionSchema = baseTransactionSchema.extend({
  id: z.string().min(1, "Transaction ID is required"),
  createdAt: z.instanceof(Date),
  updatedAt: z.instanceof(Date),
  category: transactionCategorySchema,
});

export const paginatedTransactionsResponseSchema =
  createPaginationResponseSchema(transactionSchema);

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof updateTransactionSchema>;
export type TransactionDto = z.infer<typeof transactionSchema>;
export type TransactionCategoryDto = z.infer<typeof transactionCategorySchema>;
export type TransactionTypeDto = z.infer<typeof transactionTypeSchema>;
export type PaginatedTransactionsResponseDto = z.infer<
  typeof paginatedTransactionsResponseSchema
>;
