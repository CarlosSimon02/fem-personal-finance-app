import {
  CreateTransactionDto,
  TransactionCategory,
  TransactionType,
  UpdateTransactionDto,
} from "@/core/schemas/transactionSchema";
import { CreateTransactionModel } from "@/data/models/transactionModel";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export class TransactionDataBuilder {
  private data: Partial<CreateTransactionModel> = {};

  static create(): TransactionDataBuilder {
    return new TransactionDataBuilder();
  }

  withId(id: string): TransactionDataBuilder {
    this.data.id = id;
    return this;
  }

  withTimestamps(timestamp: FieldValue): TransactionDataBuilder {
    this.data.createdAt = timestamp;
    this.data.updatedAt = timestamp;
    return this;
  }

  withUpdateTimestamp(timestamp: FieldValue): TransactionDataBuilder {
    this.data.updatedAt = timestamp;
    return this;
  }

  withBasicFields(
    input: CreateTransactionDto | UpdateTransactionDto
  ): TransactionDataBuilder {
    if ("name" in input && input.name !== undefined)
      this.data.name = input.name;
    if ("type" in input && input.type !== undefined)
      this.data.type = input.type;
    if ("amount" in input && input.amount !== undefined) {
      this.data.amount = input.amount;
      this.data.signedAmount = this.calculateSignedAmount(
        input.amount,
        input.type || this.data.type!
      );
    }
    if ("recipientOrPayer" in input && input.recipientOrPayer !== undefined) {
      this.data.recipientOrPayer = input.recipientOrPayer;
    }
    if ("description" in input && input.description !== undefined) {
      this.data.description = input.description;
    }
    if ("emoji" in input && input.emoji !== undefined)
      this.data.emoji = input.emoji;
    return this;
  }

  withTransactionDate(date: Date): TransactionDataBuilder {
    this.data.transactionDate = Timestamp.fromDate(date);
    return this;
  }

  withCategory(category: TransactionCategory): TransactionDataBuilder {
    this.data.category = category;
    return this;
  }

  private calculateSignedAmount(amount: number, type: TransactionType): number {
    return type === "income" ? amount : -amount;
  }

  build(): CreateTransactionModel {
    if (
      !this.data.id ||
      !this.data.type ||
      !this.data.amount ||
      !this.data.name ||
      !this.data.emoji ||
      !this.data.category ||
      !this.data.transactionDate ||
      !this.data.createdAt ||
      !this.data.updatedAt ||
      this.data.signedAmount === undefined
    ) {
      throw new Error("Missing required fields for transaction creation");
    }

    return {
      id: this.data.id,
      type: this.data.type,
      amount: this.data.amount,
      signedAmount: this.data.signedAmount,
      name: this.data.name,
      recipientOrPayer: this.data.recipientOrPayer ?? null,
      category: this.data.category,
      transactionDate: this.data.transactionDate,
      description: this.data.description ?? null,
      emoji: this.data.emoji,
      createdAt: this.data.createdAt,
      updatedAt: this.data.updatedAt,
    };
  }
}
