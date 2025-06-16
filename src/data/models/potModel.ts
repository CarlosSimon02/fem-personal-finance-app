import { createPaginationResponseSchema } from "@/core/schemas/paginationSchema";
import { moneyOperationSchema, potSchema } from "@/core/schemas/potSchema";
import { z } from "zod";
import { zFieldValue, zTimestamp } from "./helpers";

export const potModelSchema = potSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
  });

export const createPotModelSchema = potModelSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zFieldValue,
    updatedAt: zFieldValue,
  });

export const updatePotModelSchema = potModelSchema
  .omit({
    totalSaved: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    updatedAt: zFieldValue,
    createdAt: zFieldValue,
  })
  .partial();

export const potModelPaginationResponseSchema =
  createPaginationResponseSchema(potModelSchema);

export type PotModel = z.infer<typeof potModelSchema>;

export type PotModelPaginationResponse = z.infer<
  typeof potModelPaginationResponseSchema
>;

export type CreatePotModel = z.infer<typeof createPotModelSchema>;
export type UpdatePotModel = z.infer<typeof updatePotModelSchema>;

export type MoneyOperationModel = z.infer<typeof moneyOperationSchema>;
