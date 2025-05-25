import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { PaginatedBudgetsResponse } from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";

export class GetPaginatedBudgetsUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedBudgetsResponse> {
    if (!userId) throw new Error("User ID is required");

    return this.budgetRepository.getPaginatedBudgets(userId, params);
  }
}
