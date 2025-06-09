import {
  BudgetDto,
  BudgetWithTotalSpendingDto,
} from "@/core/schemas/budgetSchema";
import { BudgetModel } from "@/data/models/budgetModel";

export class BudgetMapper {
  static toDto(model: BudgetModel): BudgetDto {
    return {
      id: model.id,
      name: model.name,
      maximumSpending: model.maximumSpending,
      colorTag: model.colorTag,
      createdAt: model.createdAt.toDate(),
      updatedAt: model.updatedAt.toDate(),
    };
  }

  static toDtoWithTotalSpending(
    model: BudgetModel
  ): BudgetWithTotalSpendingDto {
    return {
      ...this.toDto(model),
      totalSpending: model.totalSpending,
    };
  }
}
