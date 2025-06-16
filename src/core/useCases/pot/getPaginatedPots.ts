import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { PaginatedPotsResponseDto } from "@/core/schemas/potSchema";

export class GetPaginatedPotsUseCase {
  constructor(private readonly potRepository: IPotRepository) {}

  async execute(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedPotsResponseDto> {
    return this.potRepository.getPaginated(userId, params);
  }
}
