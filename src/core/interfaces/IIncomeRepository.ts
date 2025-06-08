import {
  CreateIncomeDto,
  IncomeDto,
  PaginatedIncomesResponse,
  PaginatedIncomesWithTransactionsResponse,
  UpdateIncomeDto,
} from "@/core/schemas/incomeSchema";
import { PaginationParams } from "../schemas/paginationSchema";

export interface IIncomeRepository {
  createIncome(userId: string, input: CreateIncomeDto): Promise<IncomeDto>;
  getIncome(userId: string, incomeId: string): Promise<IncomeDto | null>;
  getPaginatedIncomes(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedIncomesResponse>;
  updateIncome(
    userId: string,
    incomeId: string,
    input: UpdateIncomeDto
  ): Promise<IncomeDto>;
  incomeExists(userId: string, incomeName: string): Promise<boolean>;
  deleteIncome(userId: string, incomeId: string): Promise<void>;
  getPaginatedIncomesWithTransactions(
    userId: string,
    params: PaginationParams,
    transactionCount?: number
  ): Promise<PaginatedIncomesWithTransactionsResponse>;
}
