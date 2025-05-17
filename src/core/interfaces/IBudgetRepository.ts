import {
  BudgetDto,
  CreateBudgetDto,
  UpdateBudgetDto,
} from "../schemas/budgetSchema";

export interface IBudgetRepository {
  createBudget(input: CreateBudgetDto): Promise<BudgetDto>;
  getBudget(userId: string, budgetId: string): Promise<BudgetDto | null>;
  getAllBudgets(userId: string): Promise<BudgetDto[]>;
  updateBudget(
    userId: string,
    budgetId: string,
    input: UpdateBudgetDto
  ): Promise<BudgetDto>;
  deleteBudget(userId: string, budgetId: string): Promise<void>;
}
