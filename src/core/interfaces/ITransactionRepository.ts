import {
  CreateTransactionDto,
  PaginatedTransactionsResponse,
  TransactionCategory,
  TransactionDto,
  TransactionPaginationParams,
  UpdateTransactionInput,
} from "@/core/schemas/transactionSchema";

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
    params: TransactionPaginationParams
  ): Promise<PaginatedTransactionsResponse>;
  updateTransaction(
    userId: string,
    transactionId: string,
    input: UpdateTransactionInput
  ): Promise<TransactionDto>;
  deleteTransaction(userId: string, transactionId: string): Promise<void>;
}
