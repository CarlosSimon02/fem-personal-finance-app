import { IncomeEntity } from "@/core/entities/IncomeEntity";
import { UserEntity } from "@/core/entities/UserEntity";
import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { CreateIncomeDto, IncomeDto } from "@/core/schemas/incomeSchema";
import { AuthError } from "@/utils/authError";

export class CreateIncomeUseCase {
  constructor(private incomeRepository: IIncomeRepository) {}

  async execute(input: CreateIncomeDto, user: UserEntity): Promise<IncomeDto> {
    if (!user) {
      throw new AuthError();
    }

    const incomeEntity = new IncomeEntity({
      ...input,
      userId: user.id,
    });

    const validatedData = incomeEntity.validateCreateIncome();

    const incomeExists = await this.incomeRepository.incomeExists(
      user.id,
      validatedData.name
    );

    if (incomeExists) {
      throw new Error("Income already exists");
    }

    return this.incomeRepository.createIncome(user.id, validatedData);
  }
}
