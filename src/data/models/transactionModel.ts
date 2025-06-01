import { createPaginationResponseSchema } from "@/core/schemas/paginationSchema";
import {
  categorySchema,
  transactionSchema,
} from "@/core/schemas/transactionSchema";
import { FieldValue } from "firebase-admin/firestore";
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

export type CreateTransactionModel = Omit<
  TransactionModel,
  "createdAt" | "updatedAt" | "transactionDate"
> & {
  transactionDate: FieldValue;
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export type UpdateTransactionModel = z.infer<
  typeof updateTransactionModelSchema
>;
