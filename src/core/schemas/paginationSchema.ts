import { z, ZodTypeAny } from "zod";

const paginationParamsSchema = z.object({
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limitPerPage: z.number().int().positive().default(10),
  }),
  sort: z.object({
    field: z.string(),
    order: z.enum(["asc", "desc"]),
  }),
  search: z.string().optional(),
});

const paginationResponseSchema = z.object({
  data: z.array(z.unknown()),
  meta: z.object({
    pagination: z.object({
      totalItems: z.number().int().positive(),
      page: z.number().int().positive().default(1),
      limitPerPage: z.number().int().positive().default(10),
      nextPage: z.number().int().positive().nullable(),
      previousPage: z.number().int().positive().nullable(),
    }),
    sort: z.object({
      field: z.string(),
      order: z.enum(["asc", "desc"]),
    }),
    search: z.string().optional(),
  }),
});

export const createPaginationParamsSchema = <T extends ZodTypeAny>(
  filterSchema: T
) => {
  return paginationParamsSchema.extend({
    filter: filterSchema,
  });
};

export const createPaginationResponseSchema = <T extends ZodTypeAny>(
  dataSchema: T
) => {
  return paginationResponseSchema.extend({
    data: z.array(dataSchema),
  });
};

export type PaginationParams = z.infer<typeof paginationParamsSchema>;
