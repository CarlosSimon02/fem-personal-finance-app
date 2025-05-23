import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { PaginatedIncomesResponse } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";

export class GetAllIncomesUseCase {
  constructor(private incomeRepository: IIncomeRepository) {}

  async execute(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedIncomesResponse> {
    if (!userId) throw new Error("User ID is required");

    return this.incomeRepository.getPaginatedIncomes(userId, params);
  }
}
