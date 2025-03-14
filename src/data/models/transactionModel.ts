import { Timestamp } from "firebase-admin/firestore";

export type TransactionCategoryModel = {
  id: string;
  name: string;
  color: string | null;
};

export type TransactionType = "income" | "expense";

export type TransactionModel = {
  id: string;
  type: TransactionType;
  amount: number;
  recipientOrPayer: string | null;
  category: TransactionCategoryModel;
  transactionDate: Timestamp;
  description: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
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
