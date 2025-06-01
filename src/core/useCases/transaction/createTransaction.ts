import { TransactionEntity } from "@/core/entities/TransactionEntity";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import {
  CreateTransactionDto,
  TransactionDto,
} from "@/core/schemas/transactionSchema";
import { AuthError } from "@/utils/authError";
export class CreateTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    input: CreateTransactionDto
  ): Promise<TransactionDto> {
    if (!userId) {
      throw new AuthError();
    }

    const transactionEntity = new TransactionEntity({
      ...input,
      userId,
    });

    const validatedTransaction = transactionEntity.validateCreateTransaction();

    return this.transactionRepository.createTransaction(
      userId,
      validatedTransaction
    );
  }
}
