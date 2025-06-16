import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  MoneyOperationInput,
  moneyOperationSchema,
  PotDto,
} from "@/core/schemas/potSchema";

export class WithdrawMoneyFromPotUseCase {
  constructor(private readonly potRepository: IPotRepository) {}

  async execute(
    userId: string,
    potId: string,
    input: MoneyOperationInput
  ): Promise<PotDto> {
    // Validate input
    const validatedData = moneyOperationSchema.parse(input);

    // Check if pot exists and has enough money
    const pot = await this.potRepository.getOneById(userId, potId);
    if (!pot) {
      throw new Error("Pot not found");
    }

    if (pot.totalSaved < validatedData.amount) {
      throw new Error("Insufficient funds in pot");
    }

    // Subtract from total saved
    return this.potRepository.withdrawMoney(
      userId,
      potId,
      validatedData.amount
    );
  }
}
