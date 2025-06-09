import {
  IncomeDto,
  IncomeDtoWithTotalEarned,
} from "@/core/schemas/incomeSchema";
import { IncomeModel } from "@/data/models/incomeModel";

export class IncomeMapper {
  static toDto(model: IncomeModel): IncomeDto {
    return {
      id: model.id,
      name: model.name,
      colorTag: model.colorTag,
      createdAt: model.createdAt.toDate(),
      updatedAt: model.updatedAt.toDate(),
    };
  }

  static toDtoWithTotalEarned(model: IncomeModel): IncomeDtoWithTotalEarned {
    return {
      ...this.toDto(model),
      totalEarned: model.totalEarned,
    };
  }
}
