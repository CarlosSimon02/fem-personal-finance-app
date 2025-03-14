import { PotEntity } from "@/core/entities/PotEntity";
import { IPotRepository } from "@/core/interfaces/IPotRepository";

export class GetPotUseCase {
  constructor(private potRepository: IPotRepository) {}

  async execute(userId: string, potId: string): Promise<PotEntity> {
    if (!userId) throw new Error("User ID is required");
    if (!potId) throw new Error("Pot ID is required");

    return this.potRepository.getPot(userId, potId);
  }
}
