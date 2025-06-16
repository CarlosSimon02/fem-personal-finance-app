import { PaginationParams } from "../schemas/paginationSchema";
import {
  CreatePotDto,
  PaginatedPotsResponseDto,
  PotDto,
  UpdatePotDto,
} from "../schemas/potSchema";

export interface IPotRepository {
  createOne(userId: string, input: CreatePotDto): Promise<PotDto>;
  getOneById(userId: string, potId: string): Promise<PotDto | null>;
  getOneByName(userId: string, name: string): Promise<PotDto | null>;
  getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedPotsResponseDto>;
  updateOne(
    userId: string,
    potId: string,
    input: UpdatePotDto
  ): Promise<PotDto>;
  deleteOne(userId: string, potId: string): Promise<void>;
  addToTotalSaved(
    userId: string,
    potId: string,
    amount: number
  ): Promise<PotDto>;
  withdrawMoney(userId: string, potId: string, amount: number): Promise<PotDto>;
}
