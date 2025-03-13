import { BudgetEntity } from "../entities/BudgetEntity";
import { CreateBudgetInput, UpdateBudgetInput } from "../schemas/budgetSchema";

export interface IBudgetRepository {
  createBudget(input: CreateBudgetInput): Promise<BudgetEntity>;
  getBudget(userId: string, budgetId: string): Promise<BudgetEntity>;
  getAllBudgets(userId: string): Promise<BudgetEntity[]>;
  updateBudget(
    userId: string,
    budgetId: string,
    input: UpdateBudgetInput
  ): Promise<BudgetEntity>;
  deleteBudget(userId: string, budgetId: string): Promise<void>;
}
