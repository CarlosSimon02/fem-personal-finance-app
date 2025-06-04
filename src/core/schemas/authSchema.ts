import { z } from "zod";

export const loginWithEmailCredentialsSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signUpCredentialsSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

export const authResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  idToken: z.string(),
  refreshToken: z.string(),
});

export type LoginWithEmailCredentialsDto = z.infer<
  typeof loginWithEmailCredentialsSchema
>;
export type SignUpCredentialsDto = z.infer<typeof signUpCredentialsSchema>;

export type AuthResponseDto = z.infer<typeof authResponseSchema>;
