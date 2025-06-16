import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { PotDto } from "@/core/schemas/potSchema";

export class GetPotUseCase {
  constructor(private readonly potRepository: IPotRepository) {}

  async execute(userId: string, potId: string): Promise<PotDto | null> {
    return this.potRepository.getOneById(userId, potId);
  }
}
