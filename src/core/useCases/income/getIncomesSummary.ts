import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { IncomesSummaryDto } from "@/core/schemas/incomeSchema";

export class GetIncomesSummaryUseCase {
  constructor(private incomeRepository: IIncomeRepository) {}

  async execute(
    userId: string,
    maxIncomesToShow?: number
  ): Promise<IncomesSummaryDto> {
    return this.incomeRepository.getSummary(userId, maxIncomesToShow);
  }
}
