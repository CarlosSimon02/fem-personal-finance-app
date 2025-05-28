"use server";

import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { UserEntity } from "@/core/entities/UserEntity";
import {
  onboardUserUseCase,
  verifyIdTokenUseCase,
} from "@/factories/authAdmin";
import { signOutUseCase } from "@/factories/authClient";
import getServerActionError from "@/utils/getServerActionError";
import { tokensToUserEntity } from "@/utils/tokensToUserEntity";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
import { removeServerCookies } from "next-firebase-auth-edge/next/cookies";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const postSignInAction = async (
  idToken: string,
  additionalInfo?: { name?: string }
): Promise<ServerActionResponse<{ userEntity: UserEntity }>> => {
  try {
    const decodedIdToken = await verifyIdTokenUseCase.execute(idToken);
    const userEntityFromToken = tokensToUserEntity(decodedIdToken);
    const userEntity: UserEntity = {
      ...userEntityFromToken,
      displayName: additionalInfo?.name ?? userEntityFromToken.displayName,
    };

    const databaseUserEntity = await onboardUserUseCase.execute(userEntity);

    await refreshCookiesWithIdToken(
      idToken,
      await headers(),
      await cookies(),
      authConfig
    );

    return { data: { userEntity: databaseUserEntity }, error: null };
  } catch (error) {
    return getServerActionError(error);
  }
};

export const logoutAction = async () => {
  await signOutUseCase.execute();

  removeServerCookies(await cookies(), { cookieName: authConfig.cookieName });
  redirect("/login");
};
