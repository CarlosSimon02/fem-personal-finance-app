import { TransactionEntity } from "@/core/entities/TransactionEntity";
import {
  UpdateTransactionInput,
  updateTransactionSchema,
} from "@/core/schemas/transactionSchema";
import { ITransactionRepository } from "../../interfaces/ITransactionRepository";

export class UpdateTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    transactionId: string,
    input: UpdateTransactionInput
  ): Promise<TransactionEntity> {
    if (!userId) throw new Error("User ID is required");
    if (!transactionId) throw new Error("Transaction ID is required");

    // Validate input
    const validatedData = updateTransactionSchema.parse(input);

    return this.transactionRepository.updateTransaction(
      userId,
      transactionId,
      validatedData
    );
  }
}
