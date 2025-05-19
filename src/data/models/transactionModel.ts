import { TransactionDto } from "@/core/schemas/transactionSchema";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export type TransactionModel = Omit<
  TransactionDto,
  "createdAt" | "updatedAt" | "transactionDate"
> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  transactionDate: Timestamp;
};

export type CreateTransactionModel = Omit<
  TransactionModel,
  "createdAt" | "updatedAt"
> & {
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export type UpdateTransactionModel = Partial<
  Omit<TransactionModel, "id" | "createdAt" | "updatedAt" | "userId">
>;
