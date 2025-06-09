import { CategoryDto } from "@/core/schemas/categorySchema";
import { CategoryModel } from "../models/categoryModel";

export class CategoryMapper {
  static toDto(model: CategoryModel): CategoryDto {
    return {
      id: model.id,
      name: model.name,
      colorTag: model.colorTag,
      createdAt: model.createdAt.toDate(),
      updatedAt: model.updatedAt.toDate(),
    };
  }
}
