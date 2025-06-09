import { categorySchema } from "@/core/schemas/categorySchema";
import { createPaginationResponseSchema } from "@/core/schemas/paginationSchema";
import { z } from "zod";
import { zFieldValue, zTimestamp } from "./helpers";

export const categoryModelSchema = categorySchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
  });

export const createCategoryModelSchema = categoryModelSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zFieldValue,
    updatedAt: zFieldValue,
  });

export const updateCategoryModelSchema = categoryModelSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    updatedAt: zFieldValue,
    createdAt: zFieldValue,
  })
  .partial();

export const categoryModelPaginationResponseSchema =
  createPaginationResponseSchema(categoryModelSchema);

export type CategoryModelPaginationResponse = z.infer<
  typeof categoryModelPaginationResponseSchema
>;
export type CategoryModel = z.infer<typeof categoryModelSchema>;
export type CreateCategoryModel = z.infer<typeof createCategoryModelSchema>;
export type UpdateCategoryModel = z.infer<typeof updateCategoryModelSchema>;
