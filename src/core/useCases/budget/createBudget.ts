import { BudgetEntity } from "@/core/entities/BudgetEntity";
import { UserEntity } from "@/core/entities/UserEntity";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto, CreateBudgetDto } from "@/core/schemas/budgetSchema";
import { AuthError } from "@/utils/authError";

export class CreateBudgetUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(input: CreateBudgetDto, user: UserEntity): Promise<BudgetDto> {
    if (!user) {
      throw new AuthError();
    }

    const budgetEntity = new BudgetEntity({
      ...input,
      userId: user.id,
    });

    const validatedData = budgetEntity.validateCreateBudget();

    const budgetExists = await this.budgetRepository.budgetExists(
      user.id,
      validatedData.name
    );

    if (budgetExists) {
      throw new Error("Budget already exists");
    }

    return this.budgetRepository.createBudget(validatedData);
  }
}
