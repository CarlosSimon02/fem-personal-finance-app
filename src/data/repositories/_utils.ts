import {
  createPaginationResponseSchema,
  PaginationParams,
} from "@/core/schemas/paginationSchema";
import { z } from "zod";

import { algoliaClient } from "@/services/algolia";
import { debugLog } from "@/utils/debugLog";
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

  // Create base query for counting
  let countQuery = searchCollection.orderBy(
    params.sort.field,
    params.sort.order
  );
  params.filters?.forEach((filter) => {
    countQuery = countQuery.where(filter.field, filter.operator, filter.value);
  });

  // Get total count
  const totalItems = (await countQuery.count().get()).data().count;
  const totalPages = Math.ceil(totalItems / params.pagination.limitPerPage);

  // Create paginated query
  let queryRef = countQuery.limit(params.pagination.limitPerPage);

  // Proper cursor-based pagination
  if (params.pagination.page > 1) {
    // First get the last document of the previous page
    const prevPageQuery = countQuery.limit(
      (params.pagination.page - 1) * params.pagination.limitPerPage
    );
    const prevPageSnapshot = await prevPageQuery.get();
    const lastDoc = prevPageSnapshot.docs[prevPageSnapshot.docs.length - 1];

    if (lastDoc) {
      queryRef = queryRef.startAfter(lastDoc);
    }
  }

  // Execute the query
  const snapshot = await queryRef.get();

  // Parse data
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

  const response = {
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

  debugLog("getFirestorePaginatedData", "response", response);

  return response;
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
