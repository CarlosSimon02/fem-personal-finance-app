import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { IncomeDto } from "@/core/schemas/incomeSchema";

export class GetIncomeUseCase {
  constructor(private incomeRepository: IIncomeRepository) {}

  async execute(userId: string, incomeId: string): Promise<IncomeDto | null> {
    if (!userId) throw new Error("User ID is required");
    if (!incomeId) throw new Error("Income ID is required");

    return this.incomeRepository.getIncome(userId, incomeId);
  }
}
