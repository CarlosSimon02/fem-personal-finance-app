import { createPaginationResponseSchema } from "@/core/schemas/paginationSchema";
import { transactionSchema } from "@/core/schemas/transactionSchema";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { zTimestamp } from "./_utils";

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
  });

export const transactionModelPaginationResponseSchema =
  createPaginationResponseSchema(transactionModelSchema);

export type TransactionModel = z.infer<typeof transactionModelSchema>;

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

export type UpdateTransactionModel = Partial<
  Omit<TransactionModel, "id" | "createdAt" | "updatedAt" | "userId">
>;
