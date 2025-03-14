import { PotEntity } from "@/core/entities/PotEntity";
import { IPotRepository } from "@/core/interfaces/IPotRepository";

export class GetAllPotsUseCase {
  constructor(private potRepository: IPotRepository) {}

  async execute(userId: string): Promise<PotEntity[]> {
    if (!userId) throw new Error("User ID is required");

    return this.potRepository.getAllPots(userId);
  }
}
