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
  CreateTransactionModel,
  TransactionModel,
  TransactionModelPaginationResponse,
  transactionModelSchema,
} from "@/data/models/transactionModel";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { getFirestorePaginatedData, getPaginatedAlgoliaData } from "./_utils";

export class TransactionRepository implements ITransactionRepository {
  private getTransactionCollection(userId: string) {
    return adminFirestore
      .collection("users")
      .doc(userId)
      .collection("transactions");
  }

  private ALGOLIA_TRANSACTIONS_INDEX = "transactions";

  async createTransaction(
    userId: string,
    input: CreateTransactionDto,
    category: TransactionCategory
  ): Promise<TransactionDto> {
    try {
      const transactionDate = Timestamp.fromDate(input.transactionDate);
      const id = nanoid(10);
      const timestamp = FieldValue.serverTimestamp();
      const data: CreateTransactionModel = {
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
      };

      const transactionRef = this.getTransactionCollection(userId).doc(data.id);
      await transactionRef.set(data);

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
      let response: TransactionModelPaginationResponse;

      if (params.search) {
        response = await getPaginatedAlgoliaData(
          this.ALGOLIA_TRANSACTIONS_INDEX,
          params,
          transactionModelSchema
        );
      } else {
        response = await getFirestorePaginatedData(
          this.getTransactionCollection(userId),
          params,
          transactionModelSchema
        );
      }

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
}
