import {
  TransactionCategoryDto,
  TransactionDto,
} from "@/core/schemas/transactionSchema";
import { TransactionModel } from "@/data/models/transactionModel";

export class TransactionMapper {
  static toDto(model: TransactionModel): TransactionDto {
    const category: TransactionCategoryDto = {
      id: model.category.id,
      name: model.category.name,
      colorTag: model.category.colorTag,
    };

    return {
      id: model.id,
      type: model.type,
      amount: model.amount,
      name: model.name,
      recipientOrPayer: model.recipientOrPayer,
      category,
      transactionDate: model.transactionDate.toDate(),
      description: model.description,
      emoji: model.emoji,
      createdAt: model.createdAt.toDate(),
      updatedAt: model.updatedAt.toDate(),
    };
  }
}
