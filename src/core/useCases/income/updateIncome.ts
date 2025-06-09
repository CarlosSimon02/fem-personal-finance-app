import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  IncomeDto,
  UpdateIncomeDto,
  updateIncomeSchema,
} from "@/core/schemas/incomeSchema";

export class UpdateIncomeUseCase {
  constructor(private incomeRepository: IIncomeRepository) {}

  async execute(
    userId: string,
    incomeId: string,
    input: UpdateIncomeDto
  ): Promise<IncomeDto> {
    if (!userId) throw new Error("User ID is required");
    if (!incomeId) throw new Error("Income ID is required");

    // Validate input
    const validatedData = updateIncomeSchema.parse(input);

    return this.incomeRepository.updateOne(userId, incomeId, validatedData);
  }
}
