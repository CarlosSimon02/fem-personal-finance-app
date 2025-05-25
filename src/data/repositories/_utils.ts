import {
  createPaginationResponseSchema,
  PaginationParams,
} from "@/core/schemas/paginationSchema";
import { z } from "zod";

import { algoliaClient } from "@/services/algolia";
import { Hit, SearchParams } from "algoliasearch";

export async function getFirestorePaginatedData<T extends z.ZodTypeAny>(
  collection: FirebaseFirestore.CollectionReference<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  >,
  params: PaginationParams,
  dataSchema: T
): Promise<z.infer<ReturnType<typeof createPaginationResponseSchema<T>>>> {
  const searchCollection = params.search
    ? collection
        .where("name", ">=", params.search)
        .where("name", "<=", params.search + "\uf8ff")
    : collection;

  // Create the base query
  let queryRef = searchCollection
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
  const totalItems = (await searchCollection.count().get()).data().count;
  const totalPages = Math.ceil(totalItems / params.pagination.limitPerPage);

  // Parse and validate the data
  const items = snapshot.docs.map((doc) => {
    return dataSchema.parse({
      id: doc.id,
      ...doc.data(),
    });
  });

  // Calculate pagination metadata
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

export async function getPaginatedAlgoliaData<T extends z.ZodTypeAny>(
  indexName: string,
  params: PaginationParams,
  dataSchema: T
): Promise<z.infer<ReturnType<typeof createPaginationResponseSchema<T>>>> {
  // Prepare Algolia search parameters
  const algoliaParams: SearchParams = {
    query: params.search || "",
    page: params.pagination.page - 1, // Algolia uses 0-based page index
    hitsPerPage: params.pagination.limitPerPage,
    attributesToRetrieve: ["*"],
    attributesToHighlight: params.search ? ["*"] : [],
    filters: params.filters
      ?.map((filter) => `${filter.field} ${filter.operator} ${filter.value}`)
      .join(" AND "),
  };

  // Execute search
  const { hits, nbHits, nbPages } = await algoliaClient.searchSingleIndex({
    indexName,
    searchParams: algoliaParams,
  });

  // Parse and validate the data
  const items = hits.map((hit: Hit<unknown>) => {
    return dataSchema.parse({
      ...hit,
    });
  });

  // Calculate pagination metadata
  const nextPage =
    params.pagination.page < (nbPages ?? 0) ? params.pagination.page + 1 : null;
  const previousPage =
    params.pagination.page > 1 ? params.pagination.page - 1 : null;

  return {
    data: items,
    meta: {
      pagination: {
        totalItems: nbHits ?? 0,
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
