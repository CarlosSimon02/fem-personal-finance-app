import { PotEntity } from "@/core/entities/PotEntity";
import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { CreatePotInput, createPotSchema } from "@/core/schemas/potSchema";

export class CreatePotUseCase {
  constructor(private potRepository: IPotRepository) {}

  async execute(input: CreatePotInput): Promise<PotEntity> {
    // Validate input
    const validatedData = createPotSchema.parse(input);

    return this.potRepository.createPot(validatedData);
  }
}
