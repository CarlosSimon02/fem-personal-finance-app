import { BudgetEntity } from "@/core/entities/BudgetEntity";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  UpdateBudgetInput,
  updateBudgetSchema,
} from "@/core/schemas/budgetSchema";

export class UpdateBudgetUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(
    userId: string,
    budgetId: string,
    input: UpdateBudgetInput
  ): Promise<BudgetEntity> {
    if (!userId) throw new Error("User ID is required");
    if (!budgetId) throw new Error("Budget ID is required");

    // Validate input
    const validatedData = updateBudgetSchema.parse(input);

    return this.budgetRepository.updateBudget(userId, budgetId, validatedData);
  }
}
