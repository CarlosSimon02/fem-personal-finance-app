import { BudgetEntity } from "@/core/entities/BudgetEntity";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";

export class GetBudgetUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(userId: string, budgetId: string): Promise<BudgetEntity> {
    if (!userId) throw new Error("User ID is required");
    if (!budgetId) throw new Error("Budget ID is required");

    return this.budgetRepository.getBudget(userId, budgetId);
  }
}
