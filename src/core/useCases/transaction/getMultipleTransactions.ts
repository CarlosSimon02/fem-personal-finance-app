import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { PaginatedTransactionsResponse } from "@/core/schemas/transactionSchema";
import { AuthError } from "@/utils/authError";

export class GetMultipleTransactionsUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponse> {
    if (!userId) {
      throw new AuthError();
    }

    return this.transactionRepository.getPaginatedTransactions(userId, params);
  }
}
