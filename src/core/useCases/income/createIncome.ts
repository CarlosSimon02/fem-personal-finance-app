import { IncomeEntity } from "@/core/entities/IncomeEntity";
import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { CreateIncomeDto, IncomeDto } from "@/core/schemas/incomeSchema";
import { AuthError } from "@/utils/authError";

export class CreateIncomeUseCase {
  constructor(private incomeRepository: IIncomeRepository) {}

  async execute(userId: string, input: CreateIncomeDto): Promise<IncomeDto> {
    if (!userId) {
      throw new AuthError();
    }

    const incomeEntity = new IncomeEntity({
      ...input,
      userId,
    });

    const validatedData = incomeEntity.validateCreateIncome();

    const incomeExists = await this.incomeRepository.incomeExists(
      userId,
      validatedData.name
    );

    if (incomeExists) {
      throw new Error("Income already exists");
    }

    return this.incomeRepository.createIncome(userId, validatedData);
  }
}
