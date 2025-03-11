import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    FIREBASE_CLIENT_EMAIL: z.string(),
    FIREBASE_PRIVATE_KEY: z.string(),
    USE_SECURE_COOKIES: z.string().transform((val) => val === "true"),
    COOKIE_SECRET_CURRENT: z.string(),
    COOKIE_SECRET_PREVIOUS: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
    NEXT_PUBLIC_IS_USING_EMULATORS: z
      .string()
      .transform((val) => val === "true"),
    NEXT_PUBLIC_EMULATOR_HOST: z.string(),
    NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT: z
      .string()
      .transform((val) => Number(val)),
    NEXT_PUBLIC_STORAGE_EMULATOR_PORT: z
      .string()
      .transform((val) => Number(val)),
    NEXT_PUBLIC_FUNCTIONS_EMULATOR_PORT: z
      .string()
      .transform((val) => Number(val)),
    NEXT_PUBLIC_AUTH_EMULATOR_HOST: z.string(),
  },
  runtimeEnv: {
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    USE_SECURE_COOKIES: process.env.USE_SECURE_COOKIES,
    COOKIE_SECRET_CURRENT: process.env.COOKIE_SECRET_CURRENT,
    COOKIE_SECRET_PREVIOUS: process.env.COOKIE_SECRET_PREVIOUS,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_IS_USING_EMULATORS: process.env.NEXT_PUBLIC_IS_USING_EMULATORS,
    NEXT_PUBLIC_EMULATOR_HOST: process.env.NEXT_PUBLIC_EMULATOR_HOST,
    NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT:
      process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT,
    NEXT_PUBLIC_STORAGE_EMULATOR_PORT:
      process.env.NEXT_PUBLIC_STORAGE_EMULATOR_PORT,
    NEXT_PUBLIC_FUNCTIONS_EMULATOR_PORT:
      process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_PORT,
    NEXT_PUBLIC_AUTH_EMULATOR_HOST: process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST,
  },
});
