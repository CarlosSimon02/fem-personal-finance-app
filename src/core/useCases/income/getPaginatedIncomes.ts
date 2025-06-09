import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { PaginatedIncomesResponseDto } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";

export class GetPaginatedIncomesUseCase {
  constructor(private incomeRepository: IIncomeRepository) {}

  async execute(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedIncomesResponseDto> {
    if (!userId) throw new Error("User ID is required");

    return this.incomeRepository.getPaginated(userId, params);
  }
}
