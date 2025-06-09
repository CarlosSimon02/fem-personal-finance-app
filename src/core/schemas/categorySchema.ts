import { z } from "zod";
import { createPaginationResponseSchema } from "./paginationSchema";
import { transactionCategorySchema } from "./transactionSchema";

export const categorySchema = transactionCategorySchema.extend({
  id: z.string().min(1, "Category ID is required"),
  createdAt: z.instanceof(Date),
  updatedAt: z.instanceof(Date),
});

export const paginatedCategoriesResponseSchema =
  createPaginationResponseSchema(categorySchema);

export type PaginatedCategoriesResponseDto = z.infer<
  typeof paginatedCategoriesResponseSchema
>;

export type CategoryDto = z.infer<typeof categorySchema>;
