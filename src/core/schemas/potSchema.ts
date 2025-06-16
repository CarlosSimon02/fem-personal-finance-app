import { z } from "zod";
import { validateOptionalHexColor } from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";

export const createPotSchema = z.object({
  name: z
    .string()
    .min(1, "Pot name is required")
    .max(50, "Pot name must be less than 50 characters"),
  colorTag: z.string().refine(validateOptionalHexColor, {
    message: "Color tag must be a valid hex color code (e.g., #FF5733)",
  }),
  target: z
    .number()
    .positive("Target must be greater than 0")
    .finite("Target must be a finite number"),
});

export const updatePotSchema = createPotSchema.partial();

export const potSchema = createPotSchema.extend({
  id: z.string().min(1, "Pot ID is required"),
  totalSaved: z.number().min(0, "Total saved cannot be negative"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const paginatedPotsResponseSchema =
  createPaginationResponseSchema(potSchema);

export const moneyOperationSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .finite("Amount must be a finite number"),
});

export type CreatePotDto = z.infer<typeof createPotSchema>;
export type UpdatePotDto = z.infer<typeof updatePotSchema>;
export type PotDto = z.infer<typeof potSchema>;
export type PaginatedPotsResponseDto = z.infer<
  typeof paginatedPotsResponseSchema
>;
export type MoneyOperationInput = z.infer<typeof moneyOperationSchema>;
