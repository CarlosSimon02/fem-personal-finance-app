import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import {
  CreateTransactionDto,
  PaginatedTransactionsResponse,
  TransactionCategory,
  TransactionDto,
  TransactionPaginationParams,
  UpdateTransactionInput,
} from "@/core/schemas/transactionSchema";
import {
  CreateTransactionModel,
  TransactionModel,
} from "@/data/models/transactionModel";
import { ALGOLIA_TRANSACTIONS_INDEX, algoliaClient } from "@/services/algolia";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import { SearchMethodParams } from "algoliasearch";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";

export class TransactionRepository implements ITransactionRepository {
  private getTransactionCollection(userId: string) {
    return adminFirestore
      .collection("users")
      .doc(userId)
      .collection("transactions");
  }

  constructor() {}

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

  async getMultipleTransactions(
    userId: string,
    params: TransactionPaginationParams
  ): Promise<PaginatedTransactionsResponse> {
    // TODO: Implement this
    console.log(userId, params);

    return {} as PaginatedTransactionsResponse;
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

  private async handleAlgoliaSearch(params: TransactionPaginationParams) {
    const searchOptions: SearchMethodParams = {
      requests: [
        {
          indexName: ALGOLIA_TRANSACTIONS_INDEX,
          query: params.search!,
          filters: params.filter.categoryId
            ? `category.id:${params.filter.categoryId}`
            : "",
          page: params.pagination.page - 1,
          hitsPerPage: params.pagination.limitPerPage,
          ranking: ["filterOnly(category.id)"],
        },
      ],
    };

    return algoliaClient.search<TransactionModel>(searchOptions);
  }
}
