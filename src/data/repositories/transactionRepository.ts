import {
  ITransactionRepository,
  PaginatedTransactionsResponse,
} from "@/core/interfaces/ITransactionRepository";
import { PaginationParams } from "@/core/schemas/paginationParams";
import {
  CreateTransactionDto,
  TransactionCategory,
  TransactionDto,
  UpdateTransactionInput,
} from "@/core/schemas/transactionSchema";
import { TransactionAdminDatasource } from "@/data/datasources/transactionDatasource";
import {
  TransactionModel,
  UpdateTransactionModel,
} from "@/data/models/transactionModel";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";

export class TransactionRepository implements ITransactionRepository {
  constructor(private transactionDatasource: TransactionAdminDatasource) {}

  async createTransaction(
    userId: string,
    input: CreateTransactionDto,
    category: TransactionCategory
  ): Promise<TransactionDto> {
    const transactionDate = Timestamp.fromDate(input.transactionDate);
    const id = nanoid(10);
    const timestamp = FieldValue.serverTimestamp();

    const transaction = await this.transactionDatasource.createTransaction(
      userId,
      {
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
      }
    );

    return this.mapTransactionModelToDto(transaction);
  }

  async getTransaction(
    userId: string,
    transactionId: string
  ): Promise<TransactionDto> {
    const transaction = await this.transactionDatasource.getTransaction(
      userId,
      transactionId
    );
    return this.mapTransactionModelToDto(transaction);
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
        this.mapTransactionModelToDto(transaction)
      ),
      nextCursor: result.nextCursor,
    };
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    input: UpdateTransactionInput
  ): Promise<TransactionDto> {
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

    return this.mapTransactionModelToDto(transaction);
  }

  async deleteTransaction(
    userId: string,
    transactionId: string
  ): Promise<void> {
    await this.transactionDatasource.deleteTransaction(userId, transactionId);
  }

  private mapTransactionModelToDto(
    transaction: TransactionModel
  ): TransactionDto {
    const category: TransactionCategory = {
      id: transaction.category.id,
      name: transaction.category.name,
      colorTag: transaction.category.color,
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
