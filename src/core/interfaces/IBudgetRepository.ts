import {
  BudgetDto,
  CreateBudgetDto,
  PaginatedBudgetsResponse,
  UpdateBudgetDto,
} from "../schemas/budgetSchema";
import { PaginationParams } from "../schemas/paginationSchema";

export interface IBudgetRepository {
  createBudget(userId: string, input: CreateBudgetDto): Promise<BudgetDto>;
  getBudget(userId: string, budgetId: string): Promise<BudgetDto | null>;
  getPaginatedBudgets(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedBudgetsResponse>;
  updateBudget(
    userId: string,
    budgetId: string,
    input: UpdateBudgetDto
  ): Promise<BudgetDto>;
  budgetExists(userId: string, budgetName: string): Promise<boolean>;
  deleteBudget(userId: string, budgetId: string): Promise<void>;
}
