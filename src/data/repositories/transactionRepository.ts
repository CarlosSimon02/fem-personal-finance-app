import {
  TransactionCategoryEntity,
  TransactionEntity,
} from "@/core/entities/TransactionEntity";
import {
  ITransactionRepository,
  PaginatedTransactionsResponse,
} from "@/core/interfaces/ITransactionRepository";
import {
  CreateTransactionInput,
  PaginationParams,
  UpdateTransactionInput,
} from "@/core/schemas/transactionSchema";
import { TransactionAdminDatasource } from "@/data/datasources/transactionDatasource";
import {
  TransactionModel,
  UpdateTransactionModel,
} from "@/data/models/transactionModel";
import { Timestamp } from "firebase-admin/firestore";

export class TransactionRepository implements ITransactionRepository {
  constructor(private transactionDatasource: TransactionAdminDatasource) {}

  async createTransaction(
    input: CreateTransactionInput
  ): Promise<TransactionEntity> {
    const transactionDate = Timestamp.fromDate(input.transactionDate);

    const transaction = await this.transactionDatasource.createTransaction(
      input.userId,
      {
        type: input.type,
        amount: input.amount,
        recipientOrPayer: input.recipientOrPayer,
        category: input.category,
        transactionDate: transactionDate,
        description: input.description,
        emoji: input.emoji,
        name: input.name,
        userId: input.userId,
      }
    );

    return this.mapTransactionModelToEntity(transaction);
  }

  async getTransaction(
    userId: string,
    transactionId: string
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionDatasource.getTransaction(
      userId,
      transactionId
    );
    return this.mapTransactionModelToEntity(transaction);
  }

  async getMultipleTransactions(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponse> {
    const result = await this.transactionDatasource.getMultipleTransactions(
      userId,
      params.limit,
      params.cursor
    );

    return {
      transactions: result.transactions.map((transaction) =>
        this.mapTransactionModelToEntity(transaction)
      ),
      nextCursor: result.nextCursor,
    };
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    input: UpdateTransactionInput
  ): Promise<TransactionEntity> {
    const updateData: UpdateTransactionModel = {
      ...input,
      transactionDate: input.transactionDate
        ? Timestamp.fromDate(input.transactionDate)
        : undefined,
    };

    const transaction = await this.transactionDatasource.updateTransaction(
      userId,
      transactionId,
      updateData
    );

    return this.mapTransactionModelToEntity(transaction);
  }

  async deleteTransaction(
    userId: string,
    transactionId: string
  ): Promise<void> {
    await this.transactionDatasource.deleteTransaction(userId, transactionId);
  }

  private mapTransactionModelToEntity(
    transaction: TransactionModel
  ): TransactionEntity {
    const category: TransactionCategoryEntity = {
      id: transaction.category.id,
      name: transaction.category.name,
      color: transaction.category.color,
    };

    return TransactionEntity.create(
      transaction.id,
      transaction.type,
      transaction.amount,
      transaction.name,
      transaction.recipientOrPayer,
      category,
      transaction.transactionDate.toDate(),
      transaction.description,
      transaction.emoji,
      transaction.createdAt ? transaction.createdAt.toDate() : undefined,
      transaction.updatedAt ? transaction.updatedAt.toDate() : undefined,
      transaction.userId
    );
  }
}
