import emojiRegex from "emoji-regex";
import { z } from "zod";
import { validateOptionalHexColor } from "./helpers";
import {
  createPaginationParamsSchema,
  createPaginationResponseSchema,
} from "./paginationSchema";

const isValidEmoji = (value: string) => {
  const trimmed = value.trim();
  return (
    trimmed.length > 0 &&
    [...trimmed.matchAll(emojiRegex())].join("") === trimmed
  );
};

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
    .finite("Amount must be a finite number"),
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

export const transactionPaginationParamsSchema = createPaginationParamsSchema(
  z.object({
    categoryId: z.string().nullable(),
  })
);

export const transactionPaginationResponseSchema =
  createPaginationResponseSchema(transactionSchema);

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionDto = z.infer<typeof transactionSchema>;
export type TransactionCategory = z.infer<typeof transactionCategorySchema>;
export type TransactionType = z.infer<typeof transactionTypeSchema>;
export type TransactionPaginationParams = z.infer<
  typeof transactionPaginationParamsSchema
>;
export type PaginatedTransactionsResponse = z.infer<
  typeof transactionPaginationResponseSchema
>;
