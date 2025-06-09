import { PaginationParams } from "@/core/schemas/paginationSchema";
import { TransactionTypeDto } from "@/core/schemas/transactionSchema";
import { AggregateField } from "firebase-admin/firestore";
import {
  CreateTransactionModel,
  createTransactionModelSchema,
  TransactionModel,
  TransactionModelPaginationResponse,
  transactionModelSchema,
  UpdateTransactionModel,
  updateTransactionModelSchema,
} from "../models/transactionModel";
import { CollectionService } from "../services/CollectionService";
import { FirestoreService } from "../services/FirestoreService";
import { ValidationService } from "../services/ValidationService";

export class TransactionDatasource {
  private readonly collectionService: CollectionService;
  private readonly validationService: ValidationService;
  private readonly firestoreService: FirestoreService;

  constructor() {
    this.collectionService = new CollectionService();
    this.validationService = new ValidationService();
    this.firestoreService = new FirestoreService();
  }

  getTransactionCollection(userId: string) {
    return this.collectionService.getTransactionCollection(userId);
  }

  async getById(userId: string, id: string): Promise<TransactionModel | null> {
    const transactionCollection = this.getTransactionCollection(userId);
    const transactionDoc = await transactionCollection.doc(id).get();

    if (!transactionDoc.exists) {
      return null;
    }

    const transaction = transactionDoc.data();
    const validatedTransaction = this.validationService.validateDocumentData(
      transactionModelSchema,
      transaction,
      {
        contextName: "TransactionDatasource",
        operationType: "read",
      }
    );

    return validatedTransaction;
  }

  async createOne(userId: string, transaction: CreateTransactionModel) {
    const transactionCollection = this.getTransactionCollection(userId);
    const validatedTransaction = this.validationService.validateDocumentData(
      createTransactionModelSchema,
      transaction,
      {
        contextName: "TransactionDatasource",
        operationType: "create",
      }
    );

    const transactionDoc = transactionCollection.doc(validatedTransaction.id);
    await transactionDoc.set(validatedTransaction);
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<TransactionModelPaginationResponse> {
    const transactionCollection = this.getTransactionCollection(userId);
    const response = await this.firestoreService.getPaginatedData(
      transactionCollection,
      params,
      transactionModelSchema
    );
    return response;
  }

  async updateOne(userId: string, id: string, data: UpdateTransactionModel) {
    const transactionCollection = this.getTransactionCollection(userId);
    const validatedData = this.validationService.validateDocumentData(
      updateTransactionModelSchema,
      data,
      {
        contextName: "TransactionDatasource",
        operationType: "update",
      }
    );
    const transactionDoc = transactionCollection.doc(id);
    await transactionDoc.update(validatedData);
  }

  async hasTransactions(userId: string, categoryId: string) {
    const transactionCollection = this.getTransactionCollection(userId);
    const transactions = await transactionCollection
      .where("category.id", "==", categoryId)
      .count()
      .get();
    return transactions.data().count > 0;
  }

  async deleteOne(userId: string, id: string) {
    const transactionCollection = this.getTransactionCollection(userId);
    const transactionDoc = transactionCollection.doc(id);
    await transactionDoc.delete();
  }

  async calculateTotalByCategory(
    userId: string,
    categoryId: string
  ): Promise<number> {
    const userTransactions = this.getTransactionCollection(userId);

    const spendingAggregation = userTransactions
      .where("category.id", "==", categoryId)
      .aggregate({
        totalSpending: AggregateField.sum("signedAmount"),
      });

    const aggregationResult = await spendingAggregation.get();
    return aggregationResult.data().totalSpending ?? 0;
  }

  async calculateTotalByType(
    userId: string,
    type: TransactionTypeDto
  ): Promise<number> {
    const userTransactions = this.getTransactionCollection(userId);
    const spendingAggregation = userTransactions
      .where("type", "==", type)
      .aggregate({
        totalSpending: AggregateField.sum("signedAmount"),
      });
    const aggregationResult = await spendingAggregation.get();
    return aggregationResult.data().totalSpending ?? 0;
  }
}
