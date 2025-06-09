import { TransactionEntity } from "@/core/entities/TransactionEntity";
import {
  TransactionDto,
  UpdateTransactionDto,
} from "@/core/schemas/transactionSchema";
import { ITransactionRepository } from "../../interfaces/ITransactionRepository";

export class UpdateTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    transactionId: string,
    input: UpdateTransactionDto
  ): Promise<TransactionDto> {
    if (!userId) throw new Error("User ID is required");
    if (!transactionId) throw new Error("Transaction ID is required");

    const transactionEntity = new TransactionEntity({
      ...input,
      id: transactionId,
      userId,
    });

    const validatedTransaction = transactionEntity.validateUpdateTransaction();

    return this.transactionRepository.updateOne(
      userId,
      transactionId,
      validatedTransaction
    );
  }
}
