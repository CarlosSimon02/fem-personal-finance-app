import {
  ITransactionRepository,
  PaginatedTransactionsResponse,
} from "@/core/interfaces/ITransactionRepository";
import { TransactionPaginationParams } from "@/core/schemas/transactionSchema";
import { AuthError } from "@/utils/authError";

export class GetMultipleTransactionsUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    params: TransactionPaginationParams
  ): Promise<PaginatedTransactionsResponse> {
    if (!userId) {
      throw new AuthError();
    }

    return this.transactionRepository.getMultipleTransactions(userId, params);
  }
}
