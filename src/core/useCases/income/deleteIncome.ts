import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";

export class DeleteIncomeUseCase {
  constructor(private incomeRepository: IIncomeRepository) {}

  async execute(userId: string, incomeId: string): Promise<void> {
    if (!userId) throw new Error("User ID is required");
    if (!incomeId) throw new Error("Income ID is required");

    await this.incomeRepository.deleteIncome(userId, incomeId);
  }
}
