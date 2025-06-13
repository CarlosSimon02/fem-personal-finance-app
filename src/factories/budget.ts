import { CreateBudgetUseCase } from "@/core/useCases/budget/createBudget";
import { DeleteBudgetUseCase } from "@/core/useCases/budget/deleteBudget";
import { GetBudgetUseCase } from "@/core/useCases/budget/getBudget";
import { GetBudgetsSummaryUseCase } from "@/core/useCases/budget/getBudgetsSummary";
import { GetPaginatedBudgetsUseCase } from "@/core/useCases/budget/getPaginatedBudgets";
import { GetPaginatedBudgetsWithTransactionsUseCase } from "@/core/useCases/budget/getPaginatedBudgetsWithTransactions";
import { UpdateBudgetUseCase } from "@/core/useCases/budget/updateBudget";
import { BudgetRepository } from "@/data/repositories/budgetRepository";

const budgetRepository = new BudgetRepository();

export const createBudgetUseCase = new CreateBudgetUseCase(budgetRepository);
export const deleteBudgetUseCase = new DeleteBudgetUseCase(budgetRepository);
export const updateBudgetUseCase = new UpdateBudgetUseCase(budgetRepository);
export const getBudgetUseCase = new GetBudgetUseCase(budgetRepository);
export const getPaginatedBudgetsUseCase = new GetPaginatedBudgetsUseCase(
  budgetRepository
);
export const getPaginatedBudgetsWithTransactionsUseCase =
  new GetPaginatedBudgetsWithTransactionsUseCase(budgetRepository);
export const getBudgetsSummaryUseCase = new GetBudgetsSummaryUseCase(
  budgetRepository
);

export { budgetRepository };
