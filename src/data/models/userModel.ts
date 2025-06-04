import { userSchema } from "@/core/schemas/userSchema";
import { z } from "zod";
import { zFieldValue, zTimestamp } from "./helpers";

export const userModelSchema = userSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
  });

export const createUserModelSchema = userModelSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: zFieldValue,
    updatedAt: zFieldValue,
  });

export const updateUserModelSchema = userModelSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    updatedAt: zFieldValue,
    createdAt: zFieldValue,
  })
  .partial();

export type UserModel = z.infer<typeof userModelSchema>;
export type CreateUserModel = z.infer<typeof createUserModelSchema>;
export type UpdateUserModel = z.infer<typeof updateUserModelSchema>;
