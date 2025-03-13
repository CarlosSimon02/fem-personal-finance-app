import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";

export class DeleteBudgetUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(userId: string, budgetId: string): Promise<void> {
    if (!userId) throw new Error("User ID is required");
    if (!budgetId) throw new Error("Budget ID is required");

    await this.budgetRepository.deleteBudget(userId, budgetId);
  }
}
