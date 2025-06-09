import {
  CreateIncomeDto,
  IncomeDto,
  IncomesSummaryDto,
  PaginatedIncomesResponseDto,
  PaginatedIncomesWithTransactionsResponseDto,
  UpdateIncomeDto,
} from "@/core/schemas/incomeSchema";
import { PaginationParams } from "../schemas/paginationSchema";

export interface IIncomeRepository {
  createOne(userId: string, input: CreateIncomeDto): Promise<IncomeDto>;
  getOneById(userId: string, incomeId: string): Promise<IncomeDto | null>;
  getOneByName(userId: string, name: string): Promise<IncomeDto | null>;
  getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedIncomesResponseDto>;
  updateOne(
    userId: string,
    incomeId: string,
    input: UpdateIncomeDto
  ): Promise<IncomeDto>;
  deleteOne(userId: string, incomeId: string): Promise<void>;
  getPaginatedWithTransactions(
    userId: string,
    params: PaginationParams,
    maxTransactionsToShow?: number
  ): Promise<PaginatedIncomesWithTransactionsResponseDto>;
  getSummary(
    userId: string,
    maxIncomesToShow?: number
  ): Promise<IncomesSummaryDto>;
}
