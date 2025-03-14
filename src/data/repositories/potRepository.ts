import { PotEntity } from "@/core/entities/PotEntity";
import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  CreatePotInput,
  MoneyOperationInput,
  UpdatePotInput,
} from "@/core/schemas/potSchema";
import { PotAdminDatasource } from "../datasources/potAdminDatasource";

export class PotRepository implements IPotRepository {
  constructor(private potDatasource: PotAdminDatasource) {}

  async createPot(input: CreatePotInput): Promise<PotEntity> {
    const pot = await this.potDatasource.createPot(input.userId, {
      name: input.name,
      target: input.target,
      theme: input.theme,
      totalSaved: input.totalSaved,
      userId: input.userId,
    });

    return this.mapToEntity(pot);
  }

  async getPot(userId: string, potId: string): Promise<PotEntity> {
    const pot = await this.potDatasource.getPot(userId, potId);
    return this.mapToEntity(pot);
  }

  async getAllPots(userId: string): Promise<PotEntity[]> {
    const pots = await this.potDatasource.getAllPots(userId);
    return pots.map((pot) => this.mapToEntity(pot));
  }

  async updatePot(
    userId: string,
    potId: string,
    input: UpdatePotInput
  ): Promise<PotEntity> {
    const pot = await this.potDatasource.updatePot(userId, potId, input);
    return this.mapToEntity(pot);
  }

  async deletePot(userId: string, potId: string): Promise<void> {
    await this.potDatasource.deletePot(userId, potId);
  }

  async addMoneyToPot(
    userId: string,
    potId: string,
    input: MoneyOperationInput
  ): Promise<PotEntity> {
    const pot = await this.potDatasource.addMoneyToPot(userId, potId, {
      amount: input.amount,
    });
    return this.mapToEntity(pot);
  }

  async withdrawMoneyFromPot(
    userId: string,
    potId: string,
    input: MoneyOperationInput
  ): Promise<PotEntity> {
    const pot = await this.potDatasource.withdrawMoneyFromPot(userId, potId, {
      amount: input.amount,
    });
    return this.mapToEntity(pot);
  }

  private mapToEntity(pot: any): PotEntity {
    return PotEntity.create(
      pot.id,
      pot.name,
      pot.target,
      pot.theme,
      pot.totalSaved,
      pot.createdAt,
      pot.updatedAt,
      pot.userId
    );
  }
}
