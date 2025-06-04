import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  BudgetDto,
  CreateBudgetDto,
  PaginatedBudgetsResponse,
  UpdateBudgetDto,
  createBudgetSchema,
  updateBudgetSchema,
} from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { BudgetMapper } from "../mappers/BudgetMapper";
import { budgetModelSchema } from "../models/budgetModel";
import { FirestoreService, ValidationService } from "./_services";

export class BudgetRepository implements IBudgetRepository {
  private readonly firestoreService: FirestoreService;
  private readonly validationService: ValidationService;
  private readonly contextName = "BudgetRepository";
  private readonly collectionName = "budgets";

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

  async createBudget(
    userId: string,
    input: CreateBudgetDto
  ): Promise<BudgetDto> {
    // ✅ Use injected validation service
    const validatedInput = this.validationService.validateInput(
      createBudgetSchema,
      input,
      { contextName: this.contextName, operationType: "create" }
    );

    // ✅ Use injected Firestore service
    const doc = await this.firestoreService.create(
      userId,
      validatedInput,
      this.getConfig()
    );

    // ✅ Validate output and map to DTO
    const validatedData = this.validationService.validateDocumentData(
      budgetModelSchema,
      doc.data(),
      {
        contextName: this.contextName,
        operationType: "read",
        documentId: doc.id,
      }
    );

    return BudgetMapper.toDto(validatedData);
  }

  async getBudget(userId: string, budgetId: string): Promise<BudgetDto | null> {
    const doc = await this.firestoreService.getById(
      userId,
      budgetId,
      this.getConfig()
    );

    if (!doc) {
      return null;
    }

    const validatedData = this.validationService.validateDocumentData(
      budgetModelSchema,
      doc.data(),
      {
        contextName: this.contextName,
        operationType: "read",
        documentId: budgetId,
      }
    );

    return BudgetMapper.toDto(validatedData);
  }

  async getPaginatedBudgets(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedBudgetsResponse> {
    const response = await this.firestoreService.getPaginated(
      userId,
      params,
      budgetModelSchema,
      this.getConfig()
    );

    return {
      data: response.data.map((budget) => BudgetMapper.toDto(budget)),
      meta: response.meta,
    };
  }

  async updateBudget(
    userId: string,
    budgetId: string,
    input: UpdateBudgetDto
  ): Promise<BudgetDto> {
    const validatedInput = this.validationService.validateInput(
      updateBudgetSchema,
      input,
      { contextName: this.contextName, operationType: "update" }
    );

    const doc = await this.firestoreService.update(
      userId,
      budgetId,
      validatedInput,
      this.getConfig()
    );

    const validatedData = this.validationService.validateDocumentData(
      budgetModelSchema,
      doc.data(),
      {
        contextName: this.contextName,
        operationType: "read",
        documentId: budgetId,
      }
    );

    return BudgetMapper.toDto(validatedData);
  }

  async budgetExists(userId: string, budgetName: string): Promise<boolean> {
    return this.firestoreService.existsByName(
      userId,
      budgetName,
      this.getConfig()
    );
  }

  async deleteBudget(userId: string, budgetId: string): Promise<void> {
    return this.firestoreService.delete(userId, budgetId, this.getConfig());
  }
}
