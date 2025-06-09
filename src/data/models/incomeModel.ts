import { incomeSchemaWithTotalEarned } from "@/core/schemas/incomeSchema";
import { createPaginationResponseSchema } from "@/core/schemas/paginationSchema";
import { z } from "zod";
import { zFieldValue, zTimestamp } from "./helpers";

export const incomeModelSchema = incomeSchemaWithTotalEarned
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
  });

export const createIncomeModelSchema = incomeModelSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zFieldValue,
    updatedAt: zFieldValue,
  });

export const updateIncomeModelSchema = incomeModelSchema
  .omit({
    totalEarned: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    updatedAt: zFieldValue,
    createdAt: zFieldValue,
  })
  .partial();

export const incomeModelPaginationResponseSchema =
  createPaginationResponseSchema(incomeModelSchema);

export type IncomeModel = z.infer<typeof incomeModelSchema>;

export type IncomeModelPaginationResponse = z.infer<
  typeof incomeModelPaginationResponseSchema
>;

export type CreateIncomeModel = z.infer<typeof createIncomeModelSchema>;
export type UpdateIncomeModel = z.infer<typeof updateIncomeModelSchema>;
