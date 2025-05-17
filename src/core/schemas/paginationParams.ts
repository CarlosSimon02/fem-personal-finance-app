import { z } from "zod";

export const paginationParamsSchema = z.object({
  limit: z.number().int().positive().default(10),
  cursor: z.string().nullable().default(null),
});

export type PaginationParams = z.infer<typeof paginationParamsSchema>;
