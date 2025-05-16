import { UserEntity } from "@/core/entities/UserEntity";
import { verifyIdTokenUseCase } from "@/factories/authAdmin";
import { tokensToUserEntity } from "@/utils/tokensToUserEntity";
import { cookies } from "next/headers";
import getServerActionError from "./getServerActionError";

type ActionWithAuthProps<T> = {
  user: UserEntity;
} & T;

export function actionWithAuth<T, R>(
  action: (params: ActionWithAuthProps<T>) => Promise<ServerActionResponse<R>>
) {
  return async (params: T): Promise<ServerActionResponse<R>> => {
    try {
      const cookieStore = await cookies();
      const idToken = cookieStore.get("idToken")?.value;

      if (!idToken) {
        throw new Error("Unauthorized");
      }

      const decodedToken = await verifyIdTokenUseCase.execute(idToken);
      const user = tokensToUserEntity(decodedToken);

      return action({ ...params, user });
    } catch (error) {
      return getServerActionError(error);
    }
  };
}
