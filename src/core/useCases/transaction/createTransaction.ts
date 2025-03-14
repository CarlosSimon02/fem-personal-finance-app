import { TransactionEntity } from "@/core/entities/TransactionEntity";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import {
  CreateTransactionInput,
  createTransactionSchema,
} from "@/core/schemas/transactionSchema";

export class CreateTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(input: CreateTransactionInput): Promise<TransactionEntity> {
    // Validate input
    const validatedData = createTransactionSchema.parse(input);

    return this.transactionRepository.createTransaction(validatedData);
  }
}
