import {
  BudgetDto,
  BudgetPaginationParams,
  BudgetPaginationResponse,
  CreateBudgetDto,
  UpdateBudgetDto,
} from "../schemas/budgetSchema";

export interface IBudgetRepository {
  createBudget(userId: string, input: CreateBudgetDto): Promise<BudgetDto>;
  getBudget(userId: string, budgetId: string): Promise<BudgetDto | null>;
  getPaginatedBudgets(
    userId: string,
    params: BudgetPaginationParams
  ): Promise<BudgetPaginationResponse>;
  updateBudget(
    userId: string,
    budgetId: string,
    input: UpdateBudgetDto
  ): Promise<BudgetDto>;
  budgetExists(userId: string, budgetName: string): Promise<boolean>;
  deleteBudget(userId: string, budgetId: string): Promise<void>;
}
