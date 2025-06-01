import {
  CreateTransactionDto,
  PaginatedCategoriesResponse,
  PaginatedTransactionsResponse,
  TransactionDto,
  UpdateTransactionDto,
} from "@/core/schemas/transactionSchema";
import { PaginationParams } from "../schemas/paginationSchema";

export interface ITransactionRepository {
  createTransaction(
    userId: string,
    input: CreateTransactionDto
  ): Promise<TransactionDto>;
  getTransaction(
    userId: string,
    transactionId: string
  ): Promise<TransactionDto | null>;
  getPaginatedTransactions(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponse>;
  updateTransaction(
    userId: string,
    transactionId: string,
    input: UpdateTransactionDto
  ): Promise<TransactionDto>;
  deleteTransaction(userId: string, transactionId: string): Promise<void>;
  getPaginatedCategories(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedCategoriesResponse>;
  migrateTransactionCategoriesToCollection(): Promise<void>;
}
