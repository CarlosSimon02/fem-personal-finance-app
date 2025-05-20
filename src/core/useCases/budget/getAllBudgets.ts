import { BudgetEntity } from "@/core/entities/BudgetEntity";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";

export class GetAllBudgetsUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(userId: string): Promise<BudgetEntity[]> {
    if (!userId) throw new Error("User ID is required");

    return this.budgetRepository.getPaginatedBudgets(userId);
  }
}
