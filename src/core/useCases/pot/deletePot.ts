import { IPotRepository } from "@/core/interfaces/IPotRepository";

export class DeletePotUseCase {
  constructor(private potRepository: IPotRepository) {}

  async execute(userId: string, potId: string): Promise<void> {
    if (!userId) throw new Error("User ID is required");
    if (!potId) throw new Error("Pot ID is required");

    await this.potRepository.deletePot(userId, potId);
  }
}
