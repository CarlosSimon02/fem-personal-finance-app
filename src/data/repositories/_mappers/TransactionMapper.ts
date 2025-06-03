import {
  CategoryDto,
  TransactionCategory,
  TransactionDto,
} from "@/core/schemas/transactionSchema";
import {
  CategoryModel,
  TransactionModel,
} from "@/data/models/transactionModel";

export class TransactionMapper {
  static toDto(model: TransactionModel): TransactionDto {
    const category: TransactionCategory = {
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

  static categoryToDto(model: CategoryModel): CategoryDto {
    return {
      id: model.id,
      name: model.name,
      colorTag: model.colorTag,
      createdAt: model.createdAt.toDate(),
      updatedAt: model.updatedAt.toDate(),
    };
  }
}
