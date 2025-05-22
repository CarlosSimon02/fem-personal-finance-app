import {
  createPaginationResponseSchema,
  PaginationParams,
} from "@/core/schemas/paginationSchema";
import { z } from "zod";

export async function getPaginatedData<T extends z.ZodTypeAny>(
  collection: FirebaseFirestore.CollectionReference<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  >,
  params: PaginationParams,
  dataSchema: T
): Promise<z.infer<ReturnType<typeof createPaginationResponseSchema<T>>>> {
  // Create the base query
  let queryRef = collection
    .orderBy(params.sort.field, params.sort.order)
    .limit(params.pagination.limitPerPage);

  // Apply filters if provided
  params.filters?.forEach((filter) => {
    queryRef = queryRef.where(filter.field, filter.operator, filter.value);
  });

  // Calculate offset for page-based pagination (not recommended for large datasets)
  const offset = (params.pagination.page - 1) * params.pagination.limitPerPage;
  if (offset > 0) {
    queryRef = queryRef.offset(offset);
  }

  // Execute the query
  const snapshot = await queryRef.get();
  const totalItems = (await collection.count().get()).data().count;

  // Parse and validate the data
  const items = snapshot.docs.map((doc) => {
    return dataSchema.parse({
      id: doc.id,
      ...doc.data(),
    });
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalItems / params.pagination.limitPerPage);
  const nextPage =
    params.pagination.page < totalPages ? params.pagination.page + 1 : null;
  const previousPage =
    params.pagination.page > 1 ? params.pagination.page - 1 : null;

  return {
    data: items,
    meta: {
      pagination: {
        totalItems,
        page: params.pagination.page,
        limitPerPage: params.pagination.limitPerPage,
        nextPage,
        previousPage,
      },
      sort: params.sort,
      filters: params.filters,
      search: params.search,
    },
  };
}
