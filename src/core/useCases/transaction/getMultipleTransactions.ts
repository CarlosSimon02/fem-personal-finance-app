import { TransactionEntity } from "@/core/entities/TransactionEntity";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";

export class GetMultipleTransactionsUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    transactionId: string
  ): Promise<TransactionEntity> {
    if (!userId) throw new Error("User ID is required");
    if (!transactionId) throw new Error("Transaction ID is required");

    return this.transactionRepository.getTransaction(userId, transactionId);
  }
}
