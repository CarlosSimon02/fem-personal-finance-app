import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import {
  CreateTransactionModel,
  PaginatedTransactionsResponse,
  TransactionModel,
  UpdateTransactionModel,
} from "../models/transactionModel";

export class TransactionAdminDatasource {
  private getTransactionCollection(userId: string) {
    return adminFirestore
      .collection("users")
      .doc(userId)
      .collection("transactions");
  }

  async createTransaction(
    userId: string,
    data: CreateTransactionModel
  ): Promise<TransactionModel> {
    try {
      const transactionRef = this.getTransactionCollection(userId).doc();
      const timestamp = FieldValue.serverTimestamp();

      const transactionData = {
        ...data,
        id: transactionRef.id,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await transactionRef.set(transactionData);

      const transactionDoc = await transactionRef.get();
      const docData = transactionDoc.data();

      if (!docData) {
        throw new Error("Transaction not found after creation");
      }

      return {
        ...docData,
        id: transactionDoc.id,
        createdAt: docData.createdAt as Timestamp,
        updatedAt: docData.updatedAt as Timestamp,
        transactionDate: data.transactionDate, // Use the provided date since Firestore might convert it
      } as TransactionModel;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to create transaction: ${err.message}`);
    }
  }

  async getTransaction(
    userId: string,
    transactionId: string
  ): Promise<TransactionModel> {
    try {
      const transactionDoc = await this.getTransactionCollection(userId)
        .doc(transactionId)
        .get();

      if (!transactionDoc.exists) {
        throw new Error("Transaction not found");
      }

      const docData = transactionDoc.data();

      return {
        ...docData,
        id: transactionDoc.id,
      } as TransactionModel;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get transaction: ${err.message}`);
    }
  }

  async getMultipleTransactions(
    userId: string,
    limit: number = 10,
    cursor: string | null = null
  ): Promise<PaginatedTransactionsResponse> {
    try {
      let query = this.getTransactionCollection(userId)
        .orderBy("transactionDate", "desc")
        .limit(limit);

      // Apply cursor if provided
      if (cursor) {
        const cursorDoc = await this.getTransactionCollection(userId)
          .doc(cursor)
          .get();
        if (cursorDoc.exists) {
          query = query.startAfter(cursorDoc);
        }
      }

      const transactionDocs = await query.get();

      // Get documents
      const transactions = transactionDocs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as TransactionModel[];

      // Determine next cursor
      const nextCursor =
        transactionDocs.size === limit
          ? transactionDocs.docs[transactionDocs.size - 1]?.id || null
          : null;

      return {
        transactions,
        nextCursor,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get transactions: ${err.message}`);
    }
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    data: UpdateTransactionModel
  ): Promise<TransactionModel> {
    try {
      const transactionRef =
        this.getTransactionCollection(userId).doc(transactionId);
      const timestamp = FieldValue.serverTimestamp();

      const updateData = {
        ...data,
        updatedAt: timestamp,
      };

      await transactionRef.update(updateData);

      // Get the updated document
      const updatedDoc = await transactionRef.get();

      if (!updatedDoc.exists) {
        throw new Error("Transaction not found after update");
      }

      const docData = updatedDoc.data();

      return {
        ...docData,
        id: updatedDoc.id,
      } as TransactionModel;
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
}
