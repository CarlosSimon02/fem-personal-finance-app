import { TransactionCategory } from "@/core/schemas/transactionSchema";

import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { TransactionType } from "@/core/schemas/transactionSchema";

export class CategoryService {
  constructor(
    private incomeRepository: IIncomeRepository,
    private budgetRepository: IBudgetRepository
  ) {}

  async getCategory(
    userId: string,
    categoryId: string,
    type: TransactionType
  ): Promise<TransactionCategory> {
    if (type === "income") {
      const category = await this.incomeRepository.getIncome(
        userId,
        categoryId
      );
      if (!category) {
        throw new Error(`Income category with ID ${categoryId} not found`);
      }
      return category;
    } else {
      const category = await this.budgetRepository.getBudget(
        userId,
        categoryId
      );
      if (!category) {
        throw new Error(`Expense category with ID ${categoryId} not found`);
      }
      return category;
    }
  }
}
