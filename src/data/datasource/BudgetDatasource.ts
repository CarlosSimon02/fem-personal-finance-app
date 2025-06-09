import { PaginationParams } from "@/core/schemas/paginationSchema";
import { AggregateField } from "firebase-admin/firestore";
import {
  BudgetModel,
  BudgetModelPaginationResponse,
  budgetModelSchema,
  CreateBudgetModel,
  createBudgetModelSchema,
  UpdateBudgetModel,
  updateBudgetModelSchema,
} from "../models/budgetModel";
import { CollectionService } from "../services/CollectionService";
import { FirestoreService } from "../services/FirestoreService";
import { ValidationService } from "../services/ValidationService";

export class BudgetDatasource {
  private readonly collectionService: CollectionService;
  private readonly validationService: ValidationService;
  private readonly firestoreService: FirestoreService;

  constructor() {
    this.collectionService = new CollectionService();
    this.validationService = new ValidationService();
    this.firestoreService = new FirestoreService();
  }

  getBudgetCollection(userId: string) {
    return this.collectionService.getBudgetCollection(userId);
  }

  async getById(userId: string, id: string): Promise<BudgetModel | null> {
    const budgetCollection = this.getBudgetCollection(userId);
    const budgetDoc = await budgetCollection.doc(id).get();
    if (!budgetDoc.exists) {
      return null;
    }

    const budget = budgetDoc.data();
    const validatedBudget = this.validationService.validateDocumentData(
      budgetModelSchema,
      budget,
      {
        contextName: "BudgetDatasource",
        operationType: "read",
      }
    );

    return validatedBudget;
  }

  async createOne(userId: string, data: CreateBudgetModel) {
    const budgetCollection = this.getBudgetCollection(userId);
    const validatedData = this.validationService.validateDocumentData(
      createBudgetModelSchema,
      data,
      {
        contextName: "BudgetDatasource",
        operationType: "create",
      }
    );
    const budgetDoc = budgetCollection.doc();
    await budgetDoc.set(validatedData);
  }

  async getByName(userId: string, name: string) {
    const budgetCollection = this.getBudgetCollection(userId);
    const budgetDoc = await budgetCollection.where("name", "==", name).get();
    if (budgetDoc.empty) {
      return null;
    }
    const budget = budgetDoc.docs[0].data();
    const validatedBudget = this.validationService.validateDocumentData(
      budgetModelSchema,
      budget,
      {
        contextName: "BudgetDatasource",
        operationType: "read",
      }
    );
    return validatedBudget;
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<BudgetModelPaginationResponse> {
    const budgetCollection = this.getBudgetCollection(userId);
    const response = await this.firestoreService.getPaginatedData(
      budgetCollection,
      params,
      budgetModelSchema
    );
    return response;
  }

  async updateOne(userId: string, id: string, data: UpdateBudgetModel) {
    const budgetCollection = this.getBudgetCollection(userId);
    const validatedData = this.validationService.validateDocumentData(
      updateBudgetModelSchema,
      data,
      {
        contextName: "BudgetDatasource",
        operationType: "update",
      }
    );
    await budgetCollection.doc(id).update(validatedData);
    return validatedData;
  }

  async deleteOne(userId: string, id: string) {
    const budgetCollection = this.getBudgetCollection(userId);
    await budgetCollection.doc(id).delete();
  }

  async setTotalSpending(
    userId: string,
    budgetId: string,
    totalSpending: number
  ) {
    const budgetCollection = this.getBudgetCollection(userId);
    await budgetCollection.doc(budgetId).update({
      totalSpending,
    });
  }

  async getTotalMaxSpending(userId: string) {
    const budgetCollection = this.getBudgetCollection(userId);
    const maxSpendingAggregation = budgetCollection.aggregate({
      totalMaxSpending: AggregateField.sum("maximumSpending"),
    });
    const aggregationResult = await maxSpendingAggregation.get();
    return aggregationResult.data().totalMaxSpending ?? 0;
  }

  async getCount(userId: string) {
    const budgetCollection = this.getBudgetCollection(userId);
    const countAggregation = budgetCollection.count();
    const aggregationResult = await countAggregation.get();
    return aggregationResult.data().count ?? 0;
  }
}
