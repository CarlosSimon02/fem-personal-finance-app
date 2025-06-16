import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CreatePotDto,
  PaginatedPotsResponseDto,
  PotDto,
  UpdatePotDto,
} from "@/core/schemas/potSchema";
import { generateId } from "@/utils/generateId";
import { PotDatasource } from "../datasource/PotDatasource";
import { TransactionDatasource } from "../datasource/TransactionDatasource";
import { PotMapper } from "../mappers/PotMapper";
import { CreatePotModel, UpdatePotModel } from "../models/potModel";
import { ErrorHandlingService } from "../services/ErrorHandlingService";
import { FirestoreService } from "../services/FirestoreService";

export class PotRepository implements IPotRepository {
  private readonly potDatasource: PotDatasource;
  private readonly transactionDatasource: TransactionDatasource;
  private readonly errorHandlingService: ErrorHandlingService;
  private readonly firestoreService: FirestoreService;

  constructor() {
    this.potDatasource = new PotDatasource();
    this.transactionDatasource = new TransactionDatasource();
    this.errorHandlingService = new ErrorHandlingService();
    this.firestoreService = new FirestoreService();
  }

  // #########################################################
  // # 🛠️ Helper Methods
  // #########################################################

  private async getAndMapPot(userId: string, potId: string): Promise<PotDto> {
    const pot = await this.potDatasource.getById(userId, potId);
    if (!pot) throw new Error(`Pot ${potId} not found for user ${userId}`);
    return PotMapper.toDto(pot);
  }

  // #########################################################
  // # 📝 Create One
  // #########################################################

  private async buildPotData(input: CreatePotDto): Promise<CreatePotModel> {
    return {
      id: generateId(),
      createdAt: this.firestoreService.getCurrentTimestamp(),
      updatedAt: this.firestoreService.getCurrentTimestamp(),
      name: input.name,
      colorTag: input.colorTag,
      target: input.target,
      totalSaved: 0,
    };
  }

  async createOne(userId: string, input: CreatePotDto): Promise<PotDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const potData = await this.buildPotData(input);

        // Save data
        await this.potDatasource.createOne(userId, potData);

        // Return data
        return await this.getAndMapPot(userId, potData.id);
      },
      {
        contextName: "PotRepository",
        operationType: "create",
        userId: userId,
        additionalInfo: {
          input: input,
        },
      },
      "Failed to create pot"
    );
  }

  // #########################################################
  // # 📃 Get One By Id
  // #########################################################

  async getOneById(userId: string, potId: string): Promise<PotDto | null> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const pot = await this.potDatasource.getById(userId, potId);

        // Return data
        return pot ? PotMapper.toDto(pot) : null;
      },
      {
        contextName: "PotRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          potId: potId,
        },
      },
      "Failed to get pot"
    );
  }

  async getOneByName(userId: string, name: string): Promise<PotDto | null> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const pot = await this.potDatasource.getByName(userId, name);
        return pot ? PotMapper.toDto(pot) : null;
      },
      {
        contextName: "PotRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          name: name,
        },
      },
      "Failed to get pot by name"
    );
  }

  // #########################################################
  // # 📗 Get Paginated
  // #########################################################

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedPotsResponseDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const response = await this.potDatasource.getPaginated(userId, params);

        // Return data
        return {
          data: response.data.map(PotMapper.toDto),
          meta: response.meta,
        };
      },
      {
        contextName: "PotRepository",
        operationType: "read",
        userId: userId,
        additionalInfo: {
          params: params,
        },
      },
      "Failed to get paginated pots"
    );
  }

  // #########################################################
  // # 📃 Update One
  // #########################################################

  private async buildUpdateData(
    currentPot: PotDto,
    input: UpdatePotDto
  ): Promise<UpdatePotModel> {
    const updateData: UpdatePotModel = {
      updatedAt: this.firestoreService.getCurrentTimestamp(),
    };

    if (input.name !== undefined && input.name !== currentPot.name) {
      updateData.name = input.name;
    }

    if (
      input.colorTag !== undefined &&
      input.colorTag !== currentPot.colorTag
    ) {
      updateData.colorTag = input.colorTag;
    }

    if (input.target !== undefined && input.target !== currentPot.target) {
      updateData.target = input.target;
    }

    return updateData;
  }

  async updateOne(
    userId: string,
    potId: string,
    input: UpdatePotDto
  ): Promise<PotDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Prepare data
        const currentPot = await this.getAndMapPot(userId, potId);
        const updateData = await this.buildUpdateData(currentPot, input);

        // Update data
        await this.potDatasource.updateOne(userId, potId, updateData);

        // Return data
        return await this.getAndMapPot(userId, potId);
      },
      {
        contextName: "PotRepository",
        operationType: "update",
        userId: userId,
        additionalInfo: {
          potId: potId,
          input: input,
        },
      },
      "Failed to update pot"
    );
  }

  // #########################################################
  // # 📄 Delete One
  // #########################################################

  async deleteOne(userId: string, potId: string): Promise<void> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        // Delete data
        await this.potDatasource.deleteOne(userId, potId);
      },
      {
        contextName: "PotRepository",
        operationType: "delete",
        userId: userId,
        additionalInfo: {
          potId: potId,
        },
      },
      "Failed to delete pot"
    );
  }

  // #########################################################
  // # 💰 Money Operations
  // #########################################################

  async addToTotalSaved(
    userId: string,
    potId: string,
    amount: number
  ): Promise<PotDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        await this.potDatasource.addToTotalSaved(userId, potId, amount);
        return await this.getAndMapPot(userId, potId);
      },
      {
        contextName: "PotRepository",
        operationType: "update",
        userId: userId,
        additionalInfo: {
          potId: potId,
          amount: amount,
        },
      },
      "Failed to add to total saved"
    );
  }

  async withdrawMoney(
    userId: string,
    potId: string,
    amount: number
  ): Promise<PotDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        await this.potDatasource.subtractFromTotalSaved(userId, potId, amount);
        return await this.getAndMapPot(userId, potId);
      },
      {
        contextName: "PotRepository",
        operationType: "update",
        userId: userId,
        additionalInfo: {
          potId: potId,
          amount: amount,
        },
      },
      "Failed to subtract from total saved"
    );
  }
}
