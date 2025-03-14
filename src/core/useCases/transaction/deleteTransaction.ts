import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";

export class DeleteTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(userId: string, transactionId: string): Promise<void> {
    if (!userId) throw new Error("User ID is required");
    if (!transactionId) throw new Error("Transaction ID is required");

    await this.transactionRepository.deleteTransaction(userId, transactionId);
  }
}
