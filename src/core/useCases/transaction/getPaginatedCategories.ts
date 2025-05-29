import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { PaginatedCategoriesResponse } from "@/core/schemas/transactionSchema";
import { AuthError } from "@/utils/authError";

export class GetPaginatedCategoriesUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedCategoriesResponse> {
    if (!userId) {
      throw new AuthError();
    }

    return this.transactionRepository.getPaginatedCategories(userId, params);
  }
}
