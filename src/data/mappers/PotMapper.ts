import { PotDto } from "@/core/schemas/potSchema";
import { PotModel } from "@/data/models/potModel";

export class PotMapper {
  static toDto(model: PotModel): PotDto {
    return {
      id: model.id,
      name: model.name,
      colorTag: model.colorTag,
      target: model.target,
      totalSaved: model.totalSaved,
      createdAt: model.createdAt.toDate(),
      updatedAt: model.updatedAt.toDate(),
    };
  }
}
