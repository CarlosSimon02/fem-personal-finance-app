import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { PaginatedCategoriesResponseDto } from "@/core/schemas/categorySchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { AuthError } from "@/utils/authError";

export class GetPaginatedCategoriesUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedCategoriesResponseDto> {
    if (!userId) {
      throw new AuthError();
    }

    return this.transactionRepository.getPaginatedCategories(userId, params);
  }
}
