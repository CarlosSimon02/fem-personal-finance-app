import { UserEntity } from "@/core/entities/UserEntity";
import { tokensToUserEntity } from "@/utils/tokensToUserEntity";
import { AuthError } from "./authError";
import { debugLog } from "./debugLog";
import { getAuthTokens } from "./getAuthTokens";
import getServerActionError from "./getServerActionError";

type ActionWithAuthProps<T> = {
  user: UserEntity;
  data: T;
};

export function actionWithAuth<T, R>(
  action: (params: ActionWithAuthProps<T>) => Promise<ServerActionResponse<R>>
) {
  return async (params: T): Promise<ServerActionResponse<R>> => {
    try {
      const tokens = await getAuthTokens();

      if (!tokens) {
        debugLog("actionWithAuth", "No tokens found");
        throw new AuthError();
      }

      const user = tokensToUserEntity(tokens.decodedToken);

      const result = await action({ data: params, user });
      return result;
    } catch (error) {
      return getServerActionError(error);
    }
  };
}
