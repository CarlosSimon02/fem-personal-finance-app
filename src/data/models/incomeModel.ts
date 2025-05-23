import { incomeSchema } from "@/core/schemas/incomeSchema";
import { createPaginationResponseSchema } from "@/core/schemas/paginationSchema";
import { z } from "zod";
import { zTimestamp } from "./_utils";

export const incomeModelSchema = incomeSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
  });

export const incomeModelPaginationResponseSchema =
  createPaginationResponseSchema(incomeModelSchema);

export type IncomeModel = z.infer<typeof incomeModelSchema>;

export type IncomeModelPaginationResponse = z.infer<
  typeof incomeModelPaginationResponseSchema
>;

export type CreateIncomeModel = Omit<
  IncomeModel,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateIncomeModel = Partial<
  Omit<IncomeModel, "id" | "createdAt" | "updatedAt" | "userId">
>;
