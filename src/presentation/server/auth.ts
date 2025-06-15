import { getAuthTokens } from "@/utils/getAuthTokens";
import { tokensToUser } from "@/utils/tokensToUser";
import { TRPCError } from "@trpc/server";

export const authMiddleware: MiddlewareFunction<any, any, any> = async ({
  ctx,
  next,
}) => {
  try {
    const tokens = await getAuthTokens();

    if (!tokens) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No authentication tokens found",
      });
    }

    const user = tokensToUser(tokens.decodedToken);

    return next({
      ctx: {
        ...ctx,
        user, // Add user to context
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication failed",
      cause: error,
    });
  }
};
