"use server";

import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { User } from "@/core/schemas/userSchema";
import {
  onboardUserUseCase,
  verifyIdTokenUseCase,
} from "@/factories/authAdmin";
import { signOutUseCase } from "@/factories/authClient";
import getServerActionError from "@/utils/getServerActionError";
import { tokensToUser } from "@/utils/tokensToUser";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
import { removeServerCookies } from "next-firebase-auth-edge/next/cookies";
import { cookies, headers } from "next/headers";

export const postSignInAction = async (
  idToken: string,
  additionalInfo?: { name?: string }
): Promise<ServerActionResponse<{ user: User }>> => {
  try {
    const decodedIdToken = await verifyIdTokenUseCase.execute(idToken);
    const userEntityFromToken = tokensToUser(decodedIdToken);
    const user: User = {
      ...userEntityFromToken,
      displayName: additionalInfo?.name ?? userEntityFromToken.displayName,
    };

    const databaseUser = await onboardUserUseCase.execute(user);

    await refreshCookiesWithIdToken(
      idToken,
      await headers(),
      await cookies(),
      authConfig
    );

    return { data: { user: databaseUser }, error: null };
  } catch (error) {
    return getServerActionError(error);
  }
};

export const logoutAction = async () => {
  await signOutUseCase.execute();

  removeServerCookies(await cookies(), { cookieName: authConfig.cookieName });
};
