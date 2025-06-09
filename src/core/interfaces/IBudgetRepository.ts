import {
  BudgetDto,
  BudgetsSummaryDto,
  CreateBudgetDto,
  PaginatedBudgetsResponseDto,
  PaginatedBudgetsWithTransactionsResponseDto,
  UpdateBudgetDto,
} from "../schemas/budgetSchema";
import { PaginationParams } from "../schemas/paginationSchema";

export interface IBudgetRepository {
  createOne(userId: string, input: CreateBudgetDto): Promise<BudgetDto>;
  getOneById(userId: string, budgetId: string): Promise<BudgetDto | null>;
  getOneByName(userId: string, name: string): Promise<BudgetDto | null>;
  getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedBudgetsResponseDto>;
  updateOne(
    userId: string,
    budgetId: string,
    input: UpdateBudgetDto
  ): Promise<BudgetDto>;
  deleteOne(userId: string, budgetId: string): Promise<void>;
  getPaginatedWithTransactions(
    userId: string,
    params: PaginationParams,
    maxTransactionsToShow?: number
  ): Promise<PaginatedBudgetsWithTransactionsResponseDto>;
  getSummary(
    userId: string,
    maxBudgetsToShow?: number
  ): Promise<BudgetsSummaryDto>;
}
