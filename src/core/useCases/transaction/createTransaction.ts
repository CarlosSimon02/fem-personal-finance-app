import { TransactionEntity } from "@/core/entities/TransactionEntity";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import {
  CreateTransactionDto,
  TransactionCategory,
  TransactionDto,
} from "@/core/schemas/transactionSchema";
import { AuthError } from "@/utils/authError";
export class CreateTransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private budgetRepository: IBudgetRepository,
    private incomeRepository: IIncomeRepository
  ) {}

  async execute(
    userId: string,
    input: CreateTransactionDto
  ): Promise<TransactionDto> {
    if (!userId) {
      throw new AuthError();
    }

    const transactionEntity = new TransactionEntity({
      ...input,
      userId,
    });

    const validatedTransaction = transactionEntity.validateCreateTransaction();

    let category: TransactionCategory;

    if (validatedTransaction.type === "income") {
      const income = await this.incomeRepository.getIncome(
        userId,
        validatedTransaction.categoryId
      );

      if (!income) {
        throw new Error("Category ID not found");
      }

      category = {
        id: income.id,
        name: income.name,
        colorTag: income.colorTag,
      };
    } else {
      const budget = await this.budgetRepository.getBudget(
        userId,
        validatedTransaction.categoryId
      );

      if (!budget) {
        throw new Error("Category ID not found");
      }

      category = {
        id: budget.id,
        name: budget.name,
        colorTag: budget.colorTag,
      };
    }

    return this.transactionRepository.createTransaction(
      userId,
      validatedTransaction,
      category
    );
  }
}
