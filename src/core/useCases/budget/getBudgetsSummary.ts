import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetsSummaryDto } from "@/core/schemas/budgetSchema";

export class GetBudgetsSummaryUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(
    userId: string,
    maxBudgetsToShow?: number
  ): Promise<BudgetsSummaryDto> {
    return this.budgetRepository.getSummary(userId, maxBudgetsToShow);
  }
}
