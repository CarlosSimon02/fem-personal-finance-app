import { IncomeDto } from "@/core/schemas/incomeSchema";
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
}
