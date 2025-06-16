import { PaginationParams } from "@/core/schemas/paginationSchema";
import hasKeys from "@/utils/hasKeys";
import { FieldValue } from "firebase-admin/firestore";
import {
  CreatePotModel,
  createPotModelSchema,
  PotModel,
  PotModelPaginationResponse,
  potModelSchema,
  UpdatePotModel,
  updatePotModelSchema,
} from "../models/potModel";
import { CollectionService } from "../services/CollectionService";
import { FirestoreService } from "../services/FirestoreService";
import { ValidationService } from "../services/ValidationService";

export class PotDatasource {
  private readonly collectionService: CollectionService;
  private readonly validationService: ValidationService;
  private readonly firestoreService: FirestoreService;

  constructor() {
    this.collectionService = new CollectionService();
    this.validationService = new ValidationService();
    this.firestoreService = new FirestoreService();
  }

  getPotCollection(userId: string) {
    return this.collectionService.getPotCollection(userId);
  }

  async getById(userId: string, id: string): Promise<PotModel | null> {
    const potCollection = this.getPotCollection(userId);
    const potDoc = await potCollection.doc(id).get();
    if (!potDoc.exists) {
      return null;
    }

    const pot = potDoc.data();
    const validatedPot = this.validationService.validateDocumentData(
      potModelSchema,
      pot,
      {
        contextName: "PotDatasource",
        operationType: "read",
      }
    );

    return validatedPot as PotModel;
  }

  async createOne(userId: string, data: CreatePotModel) {
    const potCollection = this.getPotCollection(userId);
    const validatedData = this.validationService.validateDocumentData(
      createPotModelSchema,
      data,
      {
        contextName: "PotDatasource",
        operationType: "create",
      }
    );
    const potDoc = potCollection.doc(validatedData.id);
    await potDoc.set(validatedData);
  }

  async getByName(userId: string, name: string) {
    const potCollection = this.getPotCollection(userId);
    const potDoc = await potCollection.where("name", "==", name).get();
    if (potDoc.empty) {
      return null;
    }
    const pot = potDoc.docs[0].data();
    const validatedPot = this.validationService.validateDocumentData(
      potModelSchema,
      pot,
      {
        contextName: "PotDatasource",
        operationType: "read",
      }
    );
    return validatedPot as PotModel;
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PotModelPaginationResponse> {
    const potCollection = this.getPotCollection(userId);
    const response = await this.firestoreService.getPaginatedData(
      potCollection,
      params,
      potModelSchema
    );
    return response;
  }

  async updateOne(userId: string, id: string, data: UpdatePotModel) {
    const potCollection = this.getPotCollection(userId);
    const validatedData = this.validationService.validateDocumentData(
      updatePotModelSchema,
      data,
      {
        contextName: "PotDatasource",
        operationType: "update",
      }
    );
    if (hasKeys(validatedData)) {
      await potCollection.doc(id).update(validatedData);
    }
  }

  async deleteOne(userId: string, id: string) {
    const potCollection = this.getPotCollection(userId);
    await potCollection.doc(id).delete();
  }

  async addToTotalSaved(userId: string, potId: string, amount: number) {
    const potCollection = this.getPotCollection(userId);
    await potCollection.doc(potId).update({
      totalSaved: FieldValue.increment(amount),
    });
  }

  async subtractFromTotalSaved(userId: string, potId: string, amount: number) {
    const potCollection = this.getPotCollection(userId);
    await potCollection.doc(potId).update({
      totalSaved: FieldValue.increment(-amount),
    });
  }
}
