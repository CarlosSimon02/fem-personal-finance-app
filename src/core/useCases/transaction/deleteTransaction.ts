import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { AuthError } from "@/utils/authError";

export class DeleteTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(userId: string, transactionId: string): Promise<void> {
    if (!userId) {
      throw new AuthError();
    }

    if (!transactionId) {
      throw new Error("Transaction ID is required");
    }

    await this.transactionRepository.deleteOne(userId, transactionId);
  }
}
