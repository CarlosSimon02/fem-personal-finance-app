import { TransactionType } from "@/core/entities/TransactionEntity";
import { Timestamp } from "firebase-admin/firestore";

export type TransactionCategoryModel = {
  id: string;
  name: string;
  color: string;
};

export type TransactionModel = {
  id: string;
  type: TransactionType;
  amount: number;
  recipientOrPayer: string | null;
  category: TransactionCategoryModel;
  transactionDate: Timestamp;
  description: string | null;
  emoji: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  name: string;
};

export type CreateTransactionModel = Omit<
  TransactionModel,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateTransactionModel = Partial<
  Omit<TransactionModel, "id" | "createdAt" | "updatedAt" | "userId">
>;

export type PaginatedTransactionsResponse = {
  transactions: TransactionModel[];
  nextCursor: string | null;
};
