import { BudgetEntity } from "@/core/entities/BudgetEntity";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto, CreateBudgetDto } from "@/core/schemas/budgetSchema";
import { AuthError } from "@/utils/authError";

export class CreateBudgetUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(userId: string, input: CreateBudgetDto): Promise<BudgetDto> {
    if (!userId) {
      throw new AuthError();
    }

    const budgetEntity = new BudgetEntity({
      ...input,
      userId,
    });

    const validatedData = budgetEntity.validateCreateBudget();

    const budgetExists = await this.budgetRepository.budgetExists(
      userId,
      validatedData.name
    );

    if (budgetExists) {
      throw new Error("Budget already exists");
    }

    return this.budgetRepository.createBudget(userId, validatedData);
  }
}
