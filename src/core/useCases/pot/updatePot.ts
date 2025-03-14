import { PotEntity } from "@/core/entities/PotEntity";
import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { UpdatePotInput, updatePotSchema } from "@/core/schemas/potSchema";

export class UpdatePotUseCase {
  constructor(private potRepository: IPotRepository) {}

  async execute(
    userId: string,
    potId: string,
    input: UpdatePotInput
  ): Promise<PotEntity> {
    if (!userId) throw new Error("User ID is required");
    if (!potId) throw new Error("Pot ID is required");

    // Validate input
    const validatedData = updatePotSchema.parse(input);

    return this.potRepository.updatePot(userId, potId, validatedData);
  }
}
