import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { PaginatedIncomesWithTransactionsResponse } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";

export class GetPaginatedIncomesWithTransactionsUseCase {
  constructor(private incomeRepository: IIncomeRepository) {}

  async execute(
    userId: string,
    params: PaginationParams,
    transactionCount?: number
  ): Promise<PaginatedIncomesWithTransactionsResponse> {
    return this.incomeRepository.getPaginatedIncomesWithTransactions(
      userId,
      params,
      transactionCount
    );
  }
}
