import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CreateTransactionDto,
  PaginatedTransactionsResponse,
  TransactionCategory,
  TransactionDto,
  UpdateTransactionInput,
} from "@/core/schemas/transactionSchema";
import {
  TransactionModel,
  transactionModelSchema,
} from "@/data/models/transactionModel";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { debugLog } from "@/utils/debugLog";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { getFirestorePaginatedData } from "./_utils";

export class TransactionRepository implements ITransactionRepository {
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

  async createTransaction(
    userId: string,
    input: CreateTransactionDto,
    category: TransactionCategory
  ): Promise<TransactionDto> {
    try {
      const batch = adminFirestore.batch();
      const transactionDate = Timestamp.fromDate(input.transactionDate);
      const id = nanoid(10);
      const timestamp = FieldValue.serverTimestamp();

      const transactionRef = this.getTransactionCollection(userId).doc(id);
      batch.set(transactionRef, {
        id,
        createdAt: timestamp,
        updatedAt: timestamp,
        type: input.type,
        amount: input.amount,
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
  ): Promise<TransactionDto> {
    try {
      const transactionDoc = await this.getTransactionCollection(userId)
        .doc(transactionId)
        .get();

      if (!transactionDoc.exists) {
        throw new Error("Transaction not found");
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
    input: UpdateTransactionInput
  ): Promise<TransactionDto> {
    try {
      const transactionRef =
        this.getTransactionCollection(userId).doc(transactionId);
      const timestamp = FieldValue.serverTimestamp();

      const updateData = {
        ...input,
        updatedAt: timestamp,
      };

      await transactionRef.update(updateData);

      // Get the updated document
      const updatedDoc = await transactionRef.get();

      if (!updatedDoc.exists) {
        throw new Error("Transaction not found after update");
      }

      const docData = updatedDoc.data();

      return this.mapTransactionModelToDto(docData as TransactionModel);
    } catch (error) {
      const err = error as Error;
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
}
