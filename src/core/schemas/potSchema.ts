import { z } from "zod";
import { validateOptionalHexColor } from "./helpers";

export const createPotSchema = z.object({
  name: z
    .string()
    .min(1, "Pot name is required")
    .max(50, "Pot name must be less than 50 characters"),
  target: z
    .number()
    .positive("Target must be greater than 0")
    .finite("Target must be a finite number")
    .nullable(),
  theme: z.string().refine(validateOptionalHexColor, {
    message: "Theme must be a valid hex color code (e.g., #FF5733)",
  }),
  totalSaved: z
    .number()
    .nonnegative("Total saved cannot be negative")
    .default(0),
  userId: z.string().min(1, "User ID is required"),
});

export const updatePotSchema = createPotSchema
  .partial()
  .omit({ userId: true, totalSaved: true });

export const moneyOperationSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .finite("Amount must be a finite number"),
});

export type CreatePotInput = z.infer<typeof createPotSchema>;
export type UpdatePotInput = z.infer<typeof updatePotSchema>;
export type MoneyOperationInput = z.infer<typeof moneyOperationSchema>;
