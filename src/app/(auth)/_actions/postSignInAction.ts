"use server";

import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { UserEntity } from "@/core/entities/UserEntity";
import {
  onboardUserUseCase,
  verifyIdTokenUseCase,
} from "@/factories/authAdmin";
import { actionWithAuth } from "@/utils/actionWithAuth";
import { tokensToUserEntity } from "@/utils/tokensToUserEntity";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
import { cookies, headers } from "next/headers";

type PostSignInParams = {
  idToken: string;
  additionalInfo?: { name?: string };
};

const postSignInAction = actionWithAuth<
  PostSignInParams,
  { userEntity: UserEntity }
>(async ({ user, idToken, additionalInfo }) => {
  const decodedIdToken = await verifyIdTokenUseCase.execute(idToken);
  const userEntityFromToken = tokensToUserEntity(decodedIdToken);

  if (userEntityFromToken.id !== user.id) {
    throw new Error("Token does not match authenticated user");
  }

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

  return {
    data: { userEntity: databaseUserEntity },
    error: null,
  };
});

export default postSignInAction;
