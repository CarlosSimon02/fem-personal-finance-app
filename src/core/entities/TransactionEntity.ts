import { ZodError } from "zod";
import { ValidationError } from "../../utils/validationError";
import {
  CreateTransactionDto,
  createTransactionSchema,
  TransactionCategory,
  TransactionType,
} from "../schemas/transactionSchema";

export class TransactionEntity {
  private id?: string;
  private type?: TransactionType;
  private amount?: number;
  private name?: string;
  private recipientOrPayer?: string | null;
  private category?: TransactionCategory;
  private categoryId?: string;
  private transactionDate?: Date;
  private description?: string | null;
  private emoji?: string;
  private createdAt?: Date;
  private updatedAt?: Date;
  private userId?: string;

  constructor({
    id,
    type,
    amount,
    name,
    recipientOrPayer,
    category,
    categoryId,
    transactionDate,
    description,
    emoji,
    createdAt,
    updatedAt,
    userId,
  }: {
    id?: string;
    type?: TransactionType;
    amount?: number;
    name?: string;
    recipientOrPayer?: string | null;
    category?: TransactionCategory;
    categoryId?: string;
    transactionDate?: Date;
    description?: string | null;
    emoji?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
  }) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.name = name;
    this.recipientOrPayer = recipientOrPayer;
    this.category = category;
    this.categoryId = categoryId;
    this.transactionDate = transactionDate;
    this.description = description;
    this.emoji = emoji;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  getAmount() {
    return this.amount;
  }

  getName() {
    return this.name;
  }

  getRecipientOrPayer() {
    return this.recipientOrPayer;
  }

  getCategory() {
    return this.category;
  }

  getCategoryId() {
    return this.categoryId;
  }

  getTransactionDate() {
    return this.transactionDate;
  }

  getDescription() {
    return this.description;
  }

  getEmoji() {
    return this.emoji;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getUserId() {
    return this.userId;
  }

  setId(id: string) {
    this.id = id;
  }

  setType(type: TransactionType) {
    this.type = type;
  }

  setAmount(amount: number) {
    this.amount = amount;
  }

  setName(name: string) {
    this.name = name;
  }

  setRecipientOrPayer(recipientOrPayer: string) {
    this.recipientOrPayer = recipientOrPayer;
  }

  setCategory(category: TransactionCategory) {
    this.category = category;
  }

  setCategoryId(categoryId: string) {
    this.categoryId = categoryId;
  }

  setTransactionDate(transactionDate: Date) {
    this.transactionDate = transactionDate;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setEmoji(emoji: string) {
    this.emoji = emoji;
  }

  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  validateCreateTransaction() {
    try {
      return createTransactionSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new ValidationError(
        {
          type: errors.type?.[0],
          amount: errors.amount?.[0],
          name: errors.name?.[0],
          recipientOrPayer: errors.recipientOrPayer?.[0],
          categoryId: errors.categoryId?.[0],
          transactionDate: errors.transactionDate?.[0],
          description: errors.description?.[0],
          emoji: errors.emoji?.[0],
        } satisfies AllUnknown<CreateTransactionDto>,
        "Invalid transaction data"
      );
    }
  }
}
