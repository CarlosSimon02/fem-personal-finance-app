import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { PaginatedTransactionsResponseDto } from "@/core/schemas/transactionSchema";
import { AuthError } from "@/utils/authError";

export class GetPaginatedTransactionsUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponseDto> {
    if (!userId) {
      throw new AuthError();
    }

    return this.transactionRepository.getPaginated(userId, params);
  }
}
