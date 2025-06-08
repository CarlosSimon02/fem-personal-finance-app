import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { PaginatedBudgetsWithTransactionsResponseDto } from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";

export class GetPaginatedBudgetsWithTransactionsUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(
    userId: string,
    params: PaginationParams,
    transactionCount?: number
  ): Promise<PaginatedBudgetsWithTransactionsResponseDto> {
    return this.budgetRepository.getPaginatedBudgetsWithTransactions(
      userId,
      params,
      transactionCount
    );
  }
}
