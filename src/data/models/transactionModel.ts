import { createPaginationResponseSchema } from "@/core/schemas/paginationSchema";
import {
  transactionCategorySchema,
  transactionSchema,
} from "@/core/schemas/transactionSchema";
import { z } from "zod";
import { zFieldValue, zTimestamp } from "./helpers";

export const transactionModelSchema = transactionSchema
  .omit({
    transactionDate: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
    transactionDate: zTimestamp,
    signedAmount: z.number(),
  });

export const createTransactionModelSchema = transactionModelSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    transactionDate: true,
  })
  .extend({
    createdAt: zFieldValue,
    updatedAt: zFieldValue,
    transactionDate: zTimestamp,
  });

export const updateTransactionModelSchema = transactionModelSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    updatedAt: zFieldValue,
    createdAt: zFieldValue,
  })
  .partial();

export const updateTransactionCategoryModelSchema = transactionCategorySchema
  .omit({ id: true })
  .partial();

export const transactionModelPaginationResponseSchema =
  createPaginationResponseSchema(transactionModelSchema);

export type TransactionModel = z.infer<typeof transactionModelSchema>;

export type TransactionModelPaginationResponse = z.infer<
  typeof transactionModelPaginationResponseSchema
>;

export type CreateTransactionModel = z.infer<
  typeof createTransactionModelSchema
>;

export type UpdateTransactionModel = z.infer<
  typeof updateTransactionModelSchema
>;

export type UpdateTransactionCategoryModel = z.infer<
  typeof updateTransactionCategoryModelSchema
>;
