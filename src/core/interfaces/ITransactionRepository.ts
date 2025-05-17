import {
  CreateTransactionDto,
  TransactionCategory,
  TransactionDto,
  UpdateTransactionInput,
} from "@/core/schemas/transactionSchema";
import { PaginationParams } from "../schemas/paginationParams";

export type PaginatedTransactionsResponse = {
  transactions: TransactionDto[];
  nextCursor: string | null;
};

export interface ITransactionRepository {
  createTransaction(
    userId: string,
    input: CreateTransactionDto,
    category: TransactionCategory
  ): Promise<TransactionDto>;
  getTransaction(
    userId: string,
    transactionId: string
  ): Promise<TransactionDto>;
  getMultipleTransactions(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponse>;
  updateTransaction(
    userId: string,
    transactionId: string,
    input: UpdateTransactionInput
  ): Promise<TransactionDto>;
  deleteTransaction(userId: string, transactionId: string): Promise<void>;
}
