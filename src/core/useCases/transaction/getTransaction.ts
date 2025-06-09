import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { TransactionDto } from "@/core/schemas/transactionSchema";

export class GetTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    transactionId: string
  ): Promise<TransactionDto | null> {
    if (!userId) throw new Error("User ID is required");
    if (!transactionId) throw new Error("Transaction ID is required");

    return this.transactionRepository.getOneById(userId, transactionId);
  }
}
