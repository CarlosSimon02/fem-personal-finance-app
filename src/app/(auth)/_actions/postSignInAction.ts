"use server";

import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { UserEntity } from "@/core/entities/UserEntity";
import { onboardUserFactory } from "@/factories/auth/onbaordUserFactory";
import { verifyIdTokenFactory } from "@/factories/auth/verifyIdTokenFactory";
import { tokensToUserEntity } from "@/utils/tokensToUserEntity";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
import { cookies, headers } from "next/headers";

const postSignInAction = async (
  idToken: string,
  additionalInfo?: { name?: string }
) => {
  const verifyIdToken = verifyIdTokenFactory();
  const onboardUser = onboardUserFactory();

  try {
    const decodedIdToken = await verifyIdToken.execute(idToken);
    const userEntityFromToken = tokensToUserEntity(decodedIdToken);
    const userEntity: UserEntity = {
      ...userEntityFromToken,
      displayName: additionalInfo?.name ?? userEntityFromToken.displayName,
    };

    const databaseUserEntity = await onboardUser.execute(userEntity);

    await refreshCookiesWithIdToken(
      idToken,
      await headers(),
      await cookies(),
      authConfig
    );

    return { success: true, userEntity: databaseUserEntity };
  } catch (error) {
    const err = error as Error;
    console.error("Post-sign-in handling failed:", error);
    return { success: false, error: err.message || "Unknown error" };
  }
};

export default postSignInAction;
