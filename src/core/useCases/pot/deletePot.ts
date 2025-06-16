import { IPotRepository } from "@/core/interfaces/IPotRepository";

export class DeletePotUseCase {
  constructor(private readonly potRepository: IPotRepository) {}

  async execute(userId: string, potId: string): Promise<void> {
    await this.potRepository.deleteOne(userId, potId);
  }
}
