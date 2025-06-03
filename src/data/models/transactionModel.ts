import { createPaginationResponseSchema } from "@/core/schemas/paginationSchema";
import {
  categorySchema,
  transactionSchema,
} from "@/core/schemas/transactionSchema";
import { z } from "zod";
import { zFieldValue, zTimestamp } from "./_utils";

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
    transactionDate: zFieldValue,
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

export const categoryModelSchema = categorySchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
  });

export const transactionModelPaginationResponseSchema =
  createPaginationResponseSchema(transactionModelSchema);

export type TransactionModel = z.infer<typeof transactionModelSchema>;
export type CategoryModel = z.infer<typeof categoryModelSchema>;

export type TransactionModelPaginationResponse = z.infer<
  typeof transactionModelPaginationResponseSchema
>;

export type CreateTransactionModel = z.infer<
  typeof createTransactionModelSchema
>;

export type UpdateTransactionModel = z.infer<
  typeof updateTransactionModelSchema
>;
