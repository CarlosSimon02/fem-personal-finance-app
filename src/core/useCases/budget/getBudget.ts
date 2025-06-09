import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto } from "@/core/schemas/budgetSchema";

export class GetBudgetUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(userId: string, budgetId: string): Promise<BudgetDto | null> {
    if (!userId) throw new Error("User ID is required");
    if (!budgetId) throw new Error("Budget ID is required");

    return this.budgetRepository.getOneById(userId, budgetId);
  }
}
