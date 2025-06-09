import {
  CreateTransactionDto,
  PaginatedTransactionsResponseDto,
  TransactionDto,
  UpdateTransactionDto,
} from "@/core/schemas/transactionSchema";
import { PaginatedCategoriesResponseDto } from "../schemas/categorySchema";
import { PaginationParams } from "../schemas/paginationSchema";

export interface ITransactionRepository {
  createOne(
    userId: string,
    input: CreateTransactionDto
  ): Promise<TransactionDto>;
  getOneById(
    userId: string,
    transactionId: string
  ): Promise<TransactionDto | null>;
  getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponseDto>;
  updateOne(
    userId: string,
    transactionId: string,
    input: UpdateTransactionDto
  ): Promise<TransactionDto>;
  deleteOne(userId: string, transactionId: string): Promise<void>;
  getPaginatedCategories(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedCategoriesResponseDto>;
}
