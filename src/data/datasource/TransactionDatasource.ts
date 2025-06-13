import { PaginationParams } from "@/core/schemas/paginationSchema";
import { TransactionTypeDto } from "@/core/schemas/transactionSchema";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import hasKeys from "@/utils/hasKeys";
import { AggregateField } from "firebase-admin/firestore";
import {
  CreateTransactionModel,
  createTransactionModelSchema,
  TransactionModel,
  TransactionModelPaginationResponse,
  transactionModelSchema,
  UpdateTransactionCategoryModel,
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
    if (hasKeys(validatedData)) {
      const transactionDoc = transactionCollection.doc(id);
      await transactionDoc.update(validatedData);
    }
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

  async updateMultipleByCategory(
    userId: string,
    categoryId: string,
    data: UpdateTransactionCategoryModel
  ) {
    const transactionCollection = this.getTransactionCollection(userId);

    // Validate the input data
    const validatedData = this.validationService.validateDocumentData(
      updateTransactionModelSchema.shape.category,
      data,
      {
        contextName: "TransactionDatasource",
        operationType: "update",
      }
    );

    // Return early if no valid data to update
    if (!validatedData || !hasKeys(validatedData)) {
      return;
    }

    // Create bulk writer instance
    const bulkWriter = adminFirestore.bulkWriter();

    // Get all transactions matching the category
    const transactions = await transactionCollection
      .where("category.id", "==", categoryId)
      .get();

    // Queue all updates
    transactions.docs.forEach((transaction) => {
      bulkWriter.update(transaction.ref, {
        "category.name": validatedData.name,
        "category.colorTag": validatedData.colorTag,
      });
    });

    // Execute all operations
    await bulkWriter.close();
  }

  async deleteMultipleByCategory(userId: string, categoryId: string) {
    const transactionCollection = this.getTransactionCollection(userId);

    // Create bulk writer instance
    const bulkWriter = adminFirestore.bulkWriter();

    // Get all transactions matching the category
    const transactions = await transactionCollection
      .where("category.id", "==", categoryId)
      .get();

    // Queue all deletes
    transactions.docs.forEach((transaction) => {
      bulkWriter.delete(transaction.ref);
    });

    // Execute all operations
    await bulkWriter.close();
  }
}
