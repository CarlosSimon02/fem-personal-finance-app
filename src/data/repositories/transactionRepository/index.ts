import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CategoryDto,
  CreateTransactionDto,
  PaginatedCategoriesResponse,
  PaginatedTransactionsResponse,
  TransactionCategory,
  TransactionDto,
  UpdateTransactionDto,
} from "@/core/schemas/transactionSchema";
import {
  CategoryModel,
  categoryModelSchema,
  TransactionModel,
  transactionModelSchema,
} from "@/data/models/transactionModel";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { debugLog } from "@/utils/debugLog";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { getFirestorePaginatedData } from "../_utils";
import { BudgetRepository } from "../budgetRepository";
import { IncomeRepository } from "../incomeRepository";
import { CategoryService } from "./categoryService";
import { TransactionBatchService } from "./transactionBatchService";
import { TransactionDataBuilder } from "./transactionDataBuilder";
import { UpdateDataBuilder } from "./updateDataBuilder";

export class TransactionRepository implements ITransactionRepository {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService(
      new IncomeRepository(),
      new BudgetRepository()
    );
  }

  private getTransactionCollection(userId: string) {
    return this.getUserCollection().doc(userId).collection("transactions");
  }

  private getCategoryCollection(userId: string) {
    return this.getUserCollection().doc(userId).collection("categories");
  }

  private getUserCollection() {
    return adminFirestore.collection("users");
  }

  private mapTransactionModelToDto(
    transaction: TransactionModel
  ): TransactionDto {
    return {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      name: transaction.name,
      recipientOrPayer: transaction.recipientOrPayer,
      category: {
        id: transaction.category.id,
        name: transaction.category.name,
        colorTag: transaction.category.colorTag,
      },
      transactionDate: transaction.transactionDate.toDate(),
      description: transaction.description,
      emoji: transaction.emoji,
      createdAt: transaction.createdAt.toDate(),
      updatedAt: transaction.updatedAt.toDate(),
    };
  }

  private mapCategoryModelToDto(category: CategoryModel): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      colorTag: category.colorTag,
      createdAt: category.createdAt.toDate(),
      updatedAt: category.updatedAt.toDate(),
    };
  }

  private async countOfTransactionsInTheCategory(
    userId: string,
    categoryId: string
  ): Promise<number> {
    const transactions = await this.getTransactionCollection(userId)
      .where("category.id", "==", categoryId)
      .count()
      .get();
    return transactions.data().count;
  }

  private async ensureCategoryExists(
    batchService: TransactionBatchService,
    userId: string,
    category: TransactionCategory,
    timestamp: FieldValue
  ): Promise<void> {
    const categoryRef = this.getCategoryCollection(userId).doc(category.id);
    await batchService.addCategoryIfNotExists(categoryRef, category, timestamp);
  }

  private async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const err = error as Error;
      debugLog("TransactionRepository", errorMessage, err);
      throw new Error(`${errorMessage}: ${err.message}`);
    }
  }

  async createTransaction(
    userId: string,
    input: CreateTransactionDto
  ): Promise<TransactionDto> {
    return this.executeWithErrorHandling(async () => {
      const id = nanoid(10);
      const timestamp = FieldValue.serverTimestamp();
      const category = await this.categoryService.getCategory(
        userId,
        input.categoryId,
        input.type
      );

      const batchService = new TransactionBatchService();
      const transactionRef = this.getTransactionCollection(userId).doc(id);

      const transactionData = TransactionDataBuilder.create()
        .withId(id)
        .withTimestamps(timestamp)
        .withBasicFields(input)
        .withTransactionDate(input.transactionDate)
        .withCategory(category)
        .build();

      batchService.addTransactionCreate(transactionRef, transactionData);
      await this.ensureCategoryExists(
        batchService,
        userId,
        category,
        timestamp
      );
      await batchService.commit();

      const createdTransaction = await transactionRef.get();
      const docData = createdTransaction.data();

      if (!docData) {
        throw new Error("Transaction not found after creation");
      }

      return this.mapTransactionModelToDto(docData as TransactionModel);
    }, "Failed to create transaction");
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    input: UpdateTransactionDto
  ): Promise<TransactionDto> {
    return this.executeWithErrorHandling(async () => {
      const currentTransaction = await this.getTransaction(
        userId,
        transactionId
      );
      if (!currentTransaction) {
        throw new Error("Transaction not found");
      }

      const batchService = new TransactionBatchService();
      const transactionRef =
        this.getTransactionCollection(userId).doc(transactionId);

      const updateData = UpdateDataBuilder.create()
        .addFieldIfChanged(input.name, currentTransaction.name, "name")
        .addFieldIfChanged(input.type, currentTransaction.type, "type")
        .addFieldIfChanged(input.amount, currentTransaction.amount, "amount")
        .addFieldIfChanged(
          input.recipientOrPayer,
          currentTransaction.recipientOrPayer,
          "recipientOrPayer"
        )
        .addFieldIfChanged(
          input.transactionDate,
          currentTransaction.transactionDate,
          "transactionDate",
          (date: Date) => Timestamp.fromDate(date)
        )
        .addFieldIfChanged(
          input.description,
          currentTransaction.description,
          "description"
        )
        .addFieldIfChanged(input.emoji, currentTransaction.emoji, "emoji")
        .build();

      // Handle signed amount recalculation
      if (input.amount !== undefined || input.type !== undefined) {
        const finalAmount = input.amount ?? currentTransaction.amount;
        const finalType = input.type ?? currentTransaction.type;
        updateData.signedAmount =
          finalType === "income" ? finalAmount : -finalAmount;
      }

      // Handle category change
      if (
        input.categoryId &&
        input.categoryId !== currentTransaction.category.id
      ) {
        const newCategory = await this.categoryService.getCategory(
          userId,
          input.categoryId,
          input.type ?? currentTransaction.type
        );
        updateData.category = newCategory;

        await this.ensureCategoryExists(
          batchService,
          userId,
          newCategory,
          FieldValue.serverTimestamp()
        );

        const transactionCount = await this.countOfTransactionsInTheCategory(
          userId,
          currentTransaction.category.id
        );
        const categoryRef = this.getCategoryCollection(userId).doc(
          currentTransaction.category.id
        );
        batchService.addCategoryDelete(categoryRef, transactionCount <= 1);
      }

      batchService.addTransactionUpdate(transactionRef, updateData);
      await batchService.commit();

      const updatedTransaction = await transactionRef.get();
      const updatedData = updatedTransaction.data() as TransactionModel;

      return this.mapTransactionModelToDto(updatedData);
    }, "Failed to update transaction");
  }

  async getTransaction(
    userId: string,
    transactionId: string
  ): Promise<TransactionDto | null> {
    return this.executeWithErrorHandling(async () => {
      const transactionDoc = await this.getTransactionCollection(userId)
        .doc(transactionId)
        .get();

      if (!transactionDoc.exists) {
        return null;
      }

      const docData = transactionDoc.data();
      return this.mapTransactionModelToDto(docData as TransactionModel);
    }, "Failed to get transaction");
  }

  async getPaginatedTransactions(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponse> {
    return this.executeWithErrorHandling(async () => {
      const response = await getFirestorePaginatedData(
        this.getTransactionCollection(userId),
        params,
        transactionModelSchema
      );

      return {
        data: response.data.map((transaction) =>
          this.mapTransactionModelToDto(transaction)
        ),
        meta: response.meta,
      };
    }, "Failed to get paginated transactions");
  }

  async deleteTransaction(
    userId: string,
    transactionId: string
  ): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      await this.getTransactionCollection(userId).doc(transactionId).delete();
    }, "Failed to delete transaction");
  }

  async getPaginatedCategories(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedCategoriesResponse> {
    return this.executeWithErrorHandling(async () => {
      const response = await getFirestorePaginatedData(
        this.getCategoryCollection(userId),
        params,
        categoryModelSchema
      );

      return {
        data: response.data.map((category) =>
          this.mapCategoryModelToDto(category)
        ),
        meta: response.meta,
      };
    }, "Failed to get paginated categories");
  }

  async migrateTransactionCategoriesToCollection(): Promise<void> {
    try {
      const batch = adminFirestore.batch();
      const usersSnapshot = await this.getUserCollection().get();

      if (usersSnapshot.empty) {
        debugLog(
          "migrateTransactionCategoriesToCollection",
          "No users found - nothing to migrate"
        );
        return;
      }

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const transactionsRef = this.getTransactionCollection(userId);
        const categoriesRef = this.getCategoryCollection(userId);

        const transactionsSnapshot = await transactionsRef.get();

        if (transactionsSnapshot.empty) {
          debugLog(
            "migrateTransactionCategoriesToCollection",
            `No transactions found for user ${userId} - skipping`
          );
          continue;
        }

        const uniqueCategories = new Map();
        const timestamp = FieldValue.serverTimestamp();

        transactionsSnapshot.forEach((transactionDoc) => {
          const transaction = transactionDoc.data() as TransactionModel;
          const category = transaction.category;

          if (category && !uniqueCategories.has(category.id)) {
            uniqueCategories.set(category.id, {
              ...category,
              createdAt: timestamp,
              updatedAt: timestamp,
            });
          }
        });

        if (uniqueCategories.size === 0) {
          debugLog(
            "migrateTransactionCategoriesToCollection",
            `No categories found in transactions for user ${userId} - skipping`
          );
          continue;
        }

        uniqueCategories.forEach((category, categoryId) => {
          const categoryRef = categoriesRef.doc(categoryId);
          batch.set(categoryRef, category);
        });
      }

      await batch.commit();

      debugLog(
        "migrateTransactionCategoriesToCollection",
        "Category migration completed for all users"
      );
    } catch (error) {
      const err = error as Error;
      debugLog(
        "migrateTransactionCategoriesToCollection",
        "Failed to create categories:",
        err
      );
      throw new Error(`Failed to create categories: ${err.message}`);
    }
  }

  async migrateTransactionAmountsToSignedAmounts(): Promise<void> {
    try {
      const batch = adminFirestore.batch();
      const usersSnapshot = await this.getUserCollection().get();

      if (usersSnapshot.empty) {
        debugLog(
          "migrateTransactionAmountsToSignedAmounts",
          "No users found - nothing to migrate"
        );
        return;
      }

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const transactionsRef = this.getTransactionCollection(userId);
        const transactionsSnapshot = await transactionsRef.get();

        if (transactionsSnapshot.empty) {
          debugLog(
            "migrateTransactionAmountsToSignedAmounts",
            `No transactions found for user ${userId} - skipping`
          );
          continue;
        }

        transactionsSnapshot.forEach((transactionDoc) => {
          const transaction = transactionDoc.data() as TransactionModel;
          const signedAmount =
            transaction.type === "income"
              ? transaction.amount
              : -transaction.amount;

          batch.update(transactionDoc.ref, {
            signedAmount,
          });
        });
      }

      await batch.commit();

      debugLog(
        "migrateTransactionAmountsToSignedAmounts",
        "Migration completed"
      );
    } catch (error) {
      const err = error as Error;
      debugLog(
        "migrateTransactionAmountsToSignedAmounts",
        "Failed to migrate amounts:",
        err
      );
      throw new Error(`Failed to migrate amounts: ${err.message}`);
    }
  }
}
