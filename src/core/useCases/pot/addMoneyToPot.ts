import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  MoneyOperationInput,
  moneyOperationSchema,
  PotDto,
} from "@/core/schemas/potSchema";

export class AddMoneyToPotUseCase {
  constructor(private readonly potRepository: IPotRepository) {}

  async execute(
    userId: string,
    potId: string,
    input: MoneyOperationInput
  ): Promise<PotDto> {
    // Validate input
    const validatedData = moneyOperationSchema.parse(input);

    // Check if pot exists
    const pot = await this.potRepository.getOneById(userId, potId);
    if (!pot) {
      throw new Error("Pot not found");
    }

    // Add to total saved
    return this.potRepository.addToTotalSaved(
      userId,
      potId,
      validatedData.amount
    );
  }
}
