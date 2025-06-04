import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  displayName: z.string().optional().nullable(),
  photoURL: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  customClaims: z.record(z.any()).optional().nullable(),
});

export const createUserSchema = userSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createUserSchema.partial();

export type UserDto = z.infer<typeof userSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type User = CreateUserDto;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
