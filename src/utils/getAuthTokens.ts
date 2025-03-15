import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { getTokens } from "next-firebase-auth-edge";
import { cookies, headers } from "next/headers";
import { cache } from "react";

export const getAuthTokens = cache(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  try {
    const tokens = await getTokens(cookieStore, {
      ...authConfig,
      headers: headerStore,
    });

    return tokens;
  } catch (error) {
    console.error("Error fetching authentication tokens:", error);
    throw new Error("Failed to fetch authentication tokens.");
  }
});
