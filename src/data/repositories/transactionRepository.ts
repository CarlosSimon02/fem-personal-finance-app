import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CategoryDto,
  CreateTransactionDto,
  PaginatedCategoriesResponse,
  PaginatedTransactionsResponse,
  TransactionCategory,
  TransactionDto,
  TransactionType,
  UpdateTransactionDto,
} from "@/core/schemas/transactionSchema";
import {
  CategoryModel,
  categoryModelSchema,
  TransactionModel,
  transactionModelSchema,
  UpdateTransactionModel,
} from "@/data/models/transactionModel";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { debugLog } from "@/utils/debugLog";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { getFirestorePaginatedData } from "./_utils";
import { BudgetRepository } from "./budgetRepository";
import { IncomeRepository } from "./incomeRepository";

export class TransactionRepository implements ITransactionRepository {
  private incomeRepository: IIncomeRepository;
  private budgetRepository: IBudgetRepository;

  constructor() {
    this.incomeRepository = new IncomeRepository();
    this.budgetRepository = new BudgetRepository();
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
    const category: TransactionCategory = {
      id: transaction.category.id,
      name: transaction.category.name,
      colorTag: transaction.category.colorTag,
    };

    return {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      name: transaction.name,
      recipientOrPayer: transaction.recipientOrPayer,
      category,
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

  private async getCategory(
    userId: string,
    categoryId: string,
    type: TransactionType
  ): Promise<TransactionCategory> {
    if (type === "income") {
      const income = await this.incomeRepository.getIncome(userId, categoryId);
      if (!income) {
        throw new Error("Category ID not found");
      }
      return income;
    } else {
      const budget = await this.budgetRepository.getBudget(userId, categoryId);
      if (!budget) {
        throw new Error("Category ID not found");
      }
      return budget;
    }
  }

  private async doesCategoryHasTransactions(
    userId: string,
    categoryId: string
  ): Promise<boolean> {
    const transactions = await this.getTransactionCollection(userId)
      .where("category.id", "==", categoryId)
      .get();
    return !transactions.empty;
  }

  async createTransaction(
    userId: string,
    input: CreateTransactionDto
  ): Promise<TransactionDto> {
    try {
      const batch = adminFirestore.batch();
      const transactionDate = Timestamp.fromDate(input.transactionDate);
      const id = nanoid(10);
      const timestamp = FieldValue.serverTimestamp();
      const category = await this.getCategory(
        userId,
        input.categoryId,
        input.type
      );

      const transactionRef = this.getTransactionCollection(userId).doc(id);
      batch.set(transactionRef, {
        id,
        createdAt: timestamp,
        updatedAt: timestamp,
        type: input.type,
        amount: input.amount,
        signedAmount: input.type === "income" ? input.amount : -input.amount,
        recipientOrPayer: input.recipientOrPayer,
        category: category,
        transactionDate: transactionDate,
        description: input.description,
        emoji: input.emoji,
        name: input.name,
      });

      const categoryRef = this.getCategoryCollection(userId).doc(category.id);
      const existingCategory = await categoryRef.get();

      // Only create the category if it doesn't exist
      if (!existingCategory.exists) {
        batch.set(categoryRef, {
          id: category.id,
          name: category.name,
          colorTag: category.colorTag,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }

      await batch.commit();

      const transactionDoc = await transactionRef.get();
      const docData = transactionDoc.data();

      if (!docData) {
        throw new Error("Transaction not found after creation");
      }

      return this.mapTransactionModelToDto(docData as TransactionModel);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create transaction: ${err.message}`);
    }
  }

  async getTransaction(
    userId: string,
    transactionId: string
  ): Promise<TransactionDto | null> {
    try {
      const transactionDoc = await this.getTransactionCollection(userId)
        .doc(transactionId)
        .get();

      if (!transactionDoc.exists) {
        return null;
      }

      const docData = transactionDoc.data();

      return this.mapTransactionModelToDto(docData as TransactionModel);
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get transaction: ${err.message}`);
    }
  }

  async getPaginatedTransactions(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponse> {
    try {
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
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get paginated transactions: ${err.message}`);
    }
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    input: UpdateTransactionDto
  ): Promise<TransactionDto> {
    try {
      const batch = adminFirestore.batch();
      const transactionRef =
        this.getTransactionCollection(userId).doc(transactionId);
      const currentTransaction = await this.getTransaction(
        userId,
        transactionId
      );

      if (!currentTransaction) {
        throw new Error("Transaction not found");
      }

      const updateData: UpdateTransactionModel = {
        updatedAt: FieldValue.serverTimestamp(),
      };

      // Handle basic field updates
      if (input.name !== undefined && input.name !== currentTransaction.name)
        updateData.name = input.name;
      if (input.type !== undefined && input.type !== currentTransaction.type)
        updateData.type = input.type;

      if (
        input.amount !== undefined &&
        input.amount !== currentTransaction.amount
      ) {
        updateData.amount = input.amount;
        // Recalculate signedAmount if amount or type changes
        updateData.signedAmount =
          (input.type ?? currentTransaction.type) === "income"
            ? input.amount
            : -input.amount;
      }
      if (
        input.recipientOrPayer !== undefined &&
        input.recipientOrPayer !== currentTransaction.recipientOrPayer
      )
        updateData.recipientOrPayer = input.recipientOrPayer;
      if (
        input.transactionDate !== undefined &&
        input.transactionDate !== currentTransaction.transactionDate
      )
        updateData.transactionDate = Timestamp.fromDate(input.transactionDate);
      if (
        input.description !== undefined &&
        input.description !== currentTransaction.description
      )
        updateData.description = input.description;
      if (input.emoji !== undefined && input.emoji !== currentTransaction.emoji)
        updateData.emoji = input.emoji;

      if (
        input.categoryId !== undefined &&
        input.categoryId !== currentTransaction.category.id
      ) {
        const category = await this.getCategory(
          userId,
          input.categoryId,
          currentTransaction.type
        );
        updateData.category = category;

        const categoryRef = this.getCategoryCollection(userId).doc(category.id);
        const existingCategory = await categoryRef.get();

        if (!existingCategory.exists) {
          batch.set(categoryRef, {
            id: category.id,
            name: category.name,
            colorTag: category.colorTag,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });
        }

        if (
          await this.doesCategoryHasTransactions(
            userId,
            currentTransaction.category.id
          )
        ) {
          const currentCategoryRef = this.getCategoryCollection(userId).doc(
            currentTransaction.category.id
          );

          batch.delete(currentCategoryRef);
        }
      }

      batch.update(transactionRef, updateData);

      await batch.commit();

      const updatedTransaction = await transactionRef.get();
      const updatedData = updatedTransaction.data() as TransactionModel;

      return this.mapTransactionModelToDto(updatedData);
    } catch (error) {
      const err = error as Error;
      debugLog("updateTransaction", "Failed to update transaction:", err);
      throw new Error(`Failed to update transaction: ${err.message}`);
    }
  }

  async deleteTransaction(
    userId: string,
    transactionId: string
  ): Promise<void> {
    try {
      await this.getTransactionCollection(userId).doc(transactionId).delete();
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to delete transaction: ${err.message}`);
    }
  }

  async getPaginatedCategories(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedCategoriesResponse> {
    try {
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
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get paginated transactions: ${err.message}`);
    }
  }

  async migrateTransactionCategoriesToCollection(): Promise<void> {
    try {
      // Create batch for this user's categories
      const batch = adminFirestore.batch();

      // Get all users
      const usersSnapshot = await this.getUserCollection().get();

      if (usersSnapshot.empty) {
        debugLog(
          "migrateTransactionCategoriesToCollection",
          "No users found - nothing to migrate"
        );
        return;
      }

      // Process each user
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const transactionsRef = this.getTransactionCollection(userId);
        const categoriesRef = this.getCategoryCollection(userId);

        // Get all transactions for this user
        const transactionsSnapshot = await transactionsRef.get();

        if (transactionsSnapshot.empty) {
          debugLog(
            "migrateTransactionCategoriesToCollection",
            `No transactions found for user ${userId} - skipping`
          );
          continue;
        }

        // Collect unique categories from transactions
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

        // Skip if no categories found
        if (uniqueCategories.size === 0) {
          debugLog(
            "migrateTransactionCategoriesToCollection",
            `No categories found in transactions for user ${userId} - skipping`
          );
          continue;
        }

        // Add each category to the batch
        uniqueCategories.forEach((category, categoryId) => {
          const categoryRef = categoriesRef.doc(categoryId);
          batch.set(categoryRef, category);
        });
      }

      // Execute batch
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

      // Get all users
      const usersSnapshot = await this.getUserCollection().get();

      if (usersSnapshot.empty) {
        debugLog(
          "migrateTransactionAmountsToSignedAmounts",
          "No users found - nothing to migrate"
        );
        return;
      }

      // Process each user
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const transactionsRef = this.getTransactionCollection(userId);

        // Get all transactions for this user
        const transactionsSnapshot = await transactionsRef.get();

        if (transactionsSnapshot.empty) {
          debugLog(
            "migrateTransactionAmountsToSignedAmounts",
            `No transactions found for user ${userId} - skipping`
          );
          continue;
        }

        // Process each transaction
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

      // Execute batch
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
