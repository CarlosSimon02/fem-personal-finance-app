import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { PaginatedIncomesWithTransactionsResponseDto } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";

export class GetPaginatedIncomesWithTransactionsUseCase {
  constructor(private incomeRepository: IIncomeRepository) {}

  async execute(
    userId: string,
    params: PaginationParams,
    transactionCount?: number
  ): Promise<PaginatedIncomesWithTransactionsResponseDto> {
    return this.incomeRepository.getPaginatedWithTransactions(
      userId,
      params,
      transactionCount
    );
  }
}
