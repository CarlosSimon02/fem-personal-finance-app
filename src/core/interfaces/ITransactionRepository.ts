import { TransactionEntity } from "@/core/entities/TransactionEntity";
import {
  CreateTransactionInput,
  PaginationParams,
  UpdateTransactionInput,
} from "@/core/schemas/transactionSchema";

export type PaginatedTransactionsResponse = {
  transactions: TransactionEntity[];
  nextCursor: string | null;
};

export interface ITransactionRepository {
  createTransaction(input: CreateTransactionInput): Promise<TransactionEntity>;
  getTransaction(
    userId: string,
    transactionId: string
  ): Promise<TransactionEntity>;
  getAllTransactions(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponse>;
  updateTransaction(
    userId: string,
    transactionId: string,
    input: UpdateTransactionInput
  ): Promise<TransactionEntity>;
  deleteTransaction(userId: string, transactionId: string): Promise<void>;
}
