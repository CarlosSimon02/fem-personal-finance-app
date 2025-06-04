import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  CreateIncomeDto,
  IncomeDto,
  PaginatedIncomesResponse,
  UpdateIncomeDto,
  createIncomeSchema,
  updateIncomeSchema,
} from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { IncomeMapper } from "../mappers/IncomeMapper";
import { incomeModelSchema } from "../models/incomeModel";
import { FirestoreService } from "../services/FirestoreService";
import { ValidationService } from "../services/ValidationService";

export class IncomeRepository implements IIncomeRepository {
  private readonly firestoreService: FirestoreService;
  private readonly validationService: ValidationService;
  private readonly contextName = "IncomeRepository";
  private readonly collectionName = "incomes";

  constructor() {
    this.firestoreService = new FirestoreService();
    this.validationService = new ValidationService();
  }

  private getConfig() {
    return {
      contextName: this.contextName,
      collectionName: this.collectionName,
    };
  }

  async createIncome(
    userId: string,
    input: CreateIncomeDto
  ): Promise<IncomeDto> {
    const validatedInput = this.validationService.validateInput(
      createIncomeSchema,
      input,
      { contextName: this.contextName, operationType: "create" }
    );

    const doc = await this.firestoreService.create(
      userId,
      validatedInput,
      this.getConfig()
    );

    const validatedData = this.validationService.validateDocumentData(
      incomeModelSchema,
      doc.data(),
      {
        contextName: this.contextName,
        operationType: "read",
        documentId: doc.id,
      }
    );

    return IncomeMapper.toDto(validatedData);
  }

  async getIncome(userId: string, incomeId: string): Promise<IncomeDto | null> {
    const doc = await this.firestoreService.getById(
      userId,
      incomeId,
      this.getConfig()
    );

    if (!doc) {
      return null;
    }

    const validatedData = this.validationService.validateDocumentData(
      incomeModelSchema,
      doc.data(),
      {
        contextName: this.contextName,
        operationType: "read",
        documentId: incomeId,
      }
    );

    return IncomeMapper.toDto(validatedData);
  }

  async getPaginatedIncomes(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedIncomesResponse> {
    const response = await this.firestoreService.getPaginated(
      userId,
      params,
      incomeModelSchema,
      this.getConfig()
    );

    return {
      data: response.data.map((income) => IncomeMapper.toDto(income)),
      meta: response.meta,
    };
  }

  async updateIncome(
    userId: string,
    incomeId: string,
    input: UpdateIncomeDto
  ): Promise<IncomeDto> {
    const validatedInput = this.validationService.validateInput(
      updateIncomeSchema,
      input,
      { contextName: this.contextName, operationType: "update" }
    );

    const doc = await this.firestoreService.update(
      userId,
      incomeId,
      validatedInput,
      this.getConfig()
    );

    const validatedData = this.validationService.validateDocumentData(
      incomeModelSchema,
      doc.data(),
      {
        contextName: this.contextName,
        operationType: "read",
        documentId: incomeId,
      }
    );

    return IncomeMapper.toDto(validatedData);
  }

  async incomeExists(userId: string, incomeName: string): Promise<boolean> {
    return this.firestoreService.existsByName(
      userId,
      incomeName,
      this.getConfig()
    );
  }

  async deleteIncome(userId: string, incomeId: string): Promise<void> {
    return this.firestoreService.delete(userId, incomeId, this.getConfig());
  }
}
