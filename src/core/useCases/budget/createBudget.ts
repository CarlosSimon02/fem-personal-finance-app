import { BudgetEntity } from "@/core/entities/BudgetEntity";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  CreateBudgetInput,
  createBudgetSchema,
} from "@/core/schemas/budgetSchema";

export class CreateBudgetUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(input: CreateBudgetInput): Promise<BudgetEntity> {
    // Validate input
    const validatedData = createBudgetSchema.parse(input);

    return this.budgetRepository.createBudget(validatedData);
  }
}
