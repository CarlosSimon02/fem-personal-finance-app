import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CreateIncomeModel,
  createIncomeModelSchema,
  IncomeModelPaginationResponse,
  incomeModelSchema,
  UpdateIncomeModel,
  updateIncomeModelSchema,
} from "../models/incomeModel";
import { CollectionService } from "../services/CollectionService";
import { FirestoreService } from "../services/FirestoreService";
import { ValidationService } from "../services/ValidationService";

export class IncomeDatasource {
  private readonly collectionService: CollectionService;
  private readonly validationService: ValidationService;
  private readonly firestoreService: FirestoreService;

  constructor() {
    this.collectionService = new CollectionService();
    this.validationService = new ValidationService();
    this.firestoreService = new FirestoreService();
  }

  getIncomeCollection(userId: string) {
    return this.collectionService.getIncomeCollection(userId);
  }

  async getById(userId: string, id: string) {
    const incomeCollection = this.getIncomeCollection(userId);
    const incomeDoc = await incomeCollection.doc(id).get();

    if (!incomeDoc.exists) {
      return null;
    }

    const income = incomeDoc.data();
    const validatedIncome = this.validationService.validateDocumentData(
      incomeModelSchema,
      income,
      {
        contextName: "IncomeDatasource",
        operationType: "read",
      }
    );

    return validatedIncome;
  }

  async createOne(userId: string, data: CreateIncomeModel) {
    const incomeCollection = this.getIncomeCollection(userId);
    const validatedData = this.validationService.validateDocumentData(
      createIncomeModelSchema,
      data,
      {
        contextName: "IncomeDatasource",
        operationType: "create",
      }
    );
    const incomeDoc = incomeCollection.doc();
    await incomeDoc.set(validatedData);
  }

  async getByName(userId: string, name: string) {
    const incomeCollection = this.getIncomeCollection(userId);
    const incomeDoc = await incomeCollection.where("name", "==", name).get();
    if (incomeDoc.empty) {
      return null;
    }
    const income = incomeDoc.docs[0].data();
    const validatedIncome = this.validationService.validateDocumentData(
      incomeModelSchema,
      income,
      {
        contextName: "IncomeDatasource",
        operationType: "read",
      }
    );
    return validatedIncome;
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<IncomeModelPaginationResponse> {
    const incomeCollection = this.getIncomeCollection(userId);
    const response = await this.firestoreService.getPaginatedData(
      incomeCollection,
      params,
      incomeModelSchema
    );
    return response;
  }

  async updateOne(userId: string, id: string, data: UpdateIncomeModel) {
    const incomeCollection = this.getIncomeCollection(userId);
    const validatedData = this.validationService.validateDocumentData(
      updateIncomeModelSchema,
      data,
      {
        contextName: "IncomeDatasource",
        operationType: "update",
      }
    );
    await incomeCollection.doc(id).update(validatedData);
    return validatedData;
  }

  async deleteOne(userId: string, id: string) {
    const incomeCollection = this.getIncomeCollection(userId);
    await incomeCollection.doc(id).delete();
  }

  async setTotalEarned(userId: string, incomeId: string, totalEarned: number) {
    const incomeCollection = this.getIncomeCollection(userId);
    await incomeCollection.doc(incomeId).update({
      totalEarned,
    });
  }

  async getCount(userId: string) {
    const incomeCollection = this.getIncomeCollection(userId);
    const countAggregation = incomeCollection.count();
    const aggregationResult = await countAggregation.get();
    return aggregationResult.data().count ?? 0;
  }
}
