import { PotEntity } from "@/core/entities/PotEntity";
import {
  CreatePotInput,
  MoneyOperationInput,
  UpdatePotInput,
} from "@/core/schemas/potSchema";

export interface IPotRepository {
  createPot(input: CreatePotInput): Promise<PotEntity>;
  getPot(userId: string, potId: string): Promise<PotEntity>;
  getAllPots(userId: string): Promise<PotEntity[]>;
  updatePot(
    userId: string,
    potId: string,
    input: UpdatePotInput
  ): Promise<PotEntity>;
  deletePot(userId: string, potId: string): Promise<void>;
  addMoneyToPot(
    userId: string,
    potId: string,
    input: MoneyOperationInput
  ): Promise<PotEntity>;
  withdrawMoneyFromPot(
    userId: string,
    potId: string,
    input: MoneyOperationInput
  ): Promise<PotEntity>;
}
