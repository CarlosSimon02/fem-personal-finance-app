import {
  CreateTransactionDto,
  PaginatedCategoriesResponse,
  PaginatedTransactionsResponse,
  TransactionCategory,
  TransactionDto,
  UpdateTransactionInput,
} from "@/core/schemas/transactionSchema";
import { PaginationParams } from "../schemas/paginationSchema";

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
  getPaginatedTransactions(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponse>;
  updateTransaction(
    userId: string,
    transactionId: string,
    input: UpdateTransactionInput
  ): Promise<TransactionDto>;
  deleteTransaction(userId: string, transactionId: string): Promise<void>;
  getPaginatedCategories(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedCategoriesResponse>;
  migrateTransactionCategoriesToCollection(): Promise<void>;
}
