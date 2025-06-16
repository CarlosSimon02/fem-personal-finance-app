import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { CreatePotDto, PotDto } from "@/core/schemas/potSchema";

export class CreatePotUseCase {
  constructor(private readonly potRepository: IPotRepository) {}

  async execute(userId: string, input: CreatePotDto): Promise<PotDto> {
    const existingPot = await this.potRepository.getOneByName(
      userId,
      input.name
    );
    if (existingPot) {
      throw new Error(`Pot with name ${input.name} already exists`);
    }

    return this.potRepository.createOne(userId, input);
  }
}
