import { PotEntity } from "@/core/entities/PotEntity";
import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  MoneyOperationInput,
  moneyOperationSchema,
} from "@/core/schemas/potSchema";

export class AddMoneyToPotUseCase {
  constructor(private potRepository: IPotRepository) {}

  async execute(
    userId: string,
    potId: string,
    input: MoneyOperationInput
  ): Promise<PotEntity> {
    if (!userId) throw new Error("User ID is required");
    if (!potId) throw new Error("Pot ID is required");

    // Validate input
    const validatedData = moneyOperationSchema.parse(input);

    return this.potRepository.addMoneyToPot(userId, potId, validatedData);
  }
}
