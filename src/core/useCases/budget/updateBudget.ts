import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  BudgetDto,
  UpdateBudgetDto,
  updateBudgetSchema,
} from "@/core/schemas/budgetSchema";

export class UpdateBudgetUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(
    userId: string,
    budgetId: string,
    input: UpdateBudgetDto
  ): Promise<BudgetDto> {
    if (!userId) throw new Error("User ID is required");
    if (!budgetId) throw new Error("Budget ID is required");

    // Validate input
    const validatedData = updateBudgetSchema.parse(input);

    return this.budgetRepository.updateBudget(userId, budgetId, validatedData);
  }
}
