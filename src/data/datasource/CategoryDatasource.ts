import { PaginationParams } from "@/core/schemas/paginationSchema";
import hasKeys from "@/utils/hasKeys";
import {
  CategoryModel,
  CategoryModelPaginationResponse,
  categoryModelSchema,
  CreateCategoryModel,
  createCategoryModelSchema,
  UpdateCategoryModel,
  updateCategoryModelSchema,
} from "../models/categoryModel";
import { CollectionService } from "../services/CollectionService";
import { FirestoreService } from "../services/FirestoreService";
import { ValidationService } from "../services/ValidationService";

export class CategoryDatasource {
  private readonly collectionService: CollectionService;
  private readonly validationService: ValidationService;
  private readonly firestoreService: FirestoreService;

  constructor() {
    this.collectionService = new CollectionService();
    this.validationService = new ValidationService();
    this.firestoreService = new FirestoreService();
  }

  getCategoryCollection(userId: string) {
    return this.collectionService.getCategoryCollection(userId);
  }

  async getById(userId: string, id: string): Promise<CategoryModel | null> {
    const categoryCollection = this.getCategoryCollection(userId);
    const categoryDoc = await categoryCollection.doc(id).get();

    if (!categoryDoc.exists) {
      return null;
    }

    const category = categoryDoc.data();
    const validatedCategory = this.validationService.validateDocumentData(
      categoryModelSchema,
      category,
      {
        contextName: "CategoryDatasource",
        operationType: "read",
      }
    );

    return validatedCategory;
  }

  async createOne(userId: string, category: CreateCategoryModel) {
    const categoryCollection = this.getCategoryCollection(userId);
    const validatedCategory = this.validationService.validateDocumentData(
      createCategoryModelSchema,
      category,
      {
        contextName: "CategoryDatasource",
        operationType: "create",
      }
    );
    const categoryDoc = categoryCollection.doc(validatedCategory.id);
    await categoryDoc.set(validatedCategory);
  }

  async deleteOne(userId: string, id: string) {
    const categoryCollection = this.getCategoryCollection(userId);
    const categoryDoc = categoryCollection.doc(id);
    await categoryDoc.delete();
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<CategoryModelPaginationResponse> {
    const categoryCollection = this.getCategoryCollection(userId);
    const response = await this.firestoreService.getPaginatedData(
      categoryCollection,
      params,
      categoryModelSchema
    );
    return response;
  }

  async updateOne(userId: string, id: string, data: UpdateCategoryModel) {
    const categoryCollection = this.getCategoryCollection(userId);
    const categoryDoc = categoryCollection.doc(id);
    const validatedData = this.validationService.validateDocumentData(
      updateCategoryModelSchema,
      data,
      {
        contextName: "CategoryDatasource",
        operationType: "update",
      }
    );
    if (validatedData && hasKeys(validatedData)) {
      await categoryDoc.update(validatedData);
    }
  }
}
