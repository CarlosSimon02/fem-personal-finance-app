import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { PotDto, UpdatePotDto } from "@/core/schemas/potSchema";

export class UpdatePotUseCase {
  constructor(private readonly potRepository: IPotRepository) {}

  async execute(
    userId: string,
    potId: string,
    input: UpdatePotDto
  ): Promise<PotDto> {
    if (input.name) {
      const existingPot = await this.potRepository.getOneByName(
        userId,
        input.name
      );
      if (existingPot && existingPot.id !== potId) {
        throw new Error(`Pot with name ${input.name} already exists`);
      }
    }

    return this.potRepository.updateOne(userId, potId, input);
  }
}
