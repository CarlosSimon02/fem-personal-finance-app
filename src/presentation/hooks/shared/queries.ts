import { PaginationParams } from "@/core/schemas/paginationSchema";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export type QueryConfig<TData, TError = Error> = {
  queryKey: unknown[];
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
};

export const useQueryWithDefaults = <TData, TError = Error>({
  queryKey,
  queryFn,
  enabled = true,
  refetchOnWindowFocus = false,
  staleTime = Infinity,
}: QueryConfig<TData, TError>) => {
  return useQuery({
    queryKey,
    queryFn,
    enabled,
    refetchOnWindowFocus,
    staleTime,
  } as UseQueryOptions<TData, TError>);
};

export const createServerActionQuery = <TData>(
  actionFn: (params?: unknown) => Promise<{ data?: TData; error?: string }>
) => {
  return async (params?: unknown): Promise<TData> => {
    const result = await actionFn(params);
    if (result.error) {
      throw new Error(result.error);
    }
    if (!result.data) {
      throw new Error("No data returned from server action");
    }
    return result.data;
  };
};

export type PaginationConfig = {
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  category?: string;
  filters?: Array<{
    field: string;
    operator: "==" | ">" | ">=" | "<" | "<=" | "!=";
    value: string;
  }>;
};

export const createPaginationParams = ({
  search = "",
  sortBy = "createdAt",
  order = "desc",
  page = 1,
  pageSize = 10,
  category,
  filters = [],
}: PaginationConfig): PaginationParams => {
  const categoryFilter =
    category && category !== "all"
      ? [{ field: "category.name", operator: "==" as const, value: category }]
      : [];

  return {
    search,
    filters: [...filters, ...categoryFilter],
    sort: {
      field: sortBy,
      order: order as "asc" | "desc",
    },
    pagination: {
      page,
      limitPerPage: pageSize,
    },
  };
};

export const createQueryKey = (
  resource: string,
  params?: unknown
): unknown[] => {
  return params ? [resource, params] : [resource];
};
