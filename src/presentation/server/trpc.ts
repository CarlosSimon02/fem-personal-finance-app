import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { tokensToUser } from "@/utils/tokensToUser";
import { initTRPC, TRPCError } from "@trpc/server";
import { getTokens } from "next-firebase-auth-edge";
import { NextRequest, NextResponse } from "next/server";

const t = initTRPC.context<{ req: NextRequest; res: NextResponse }>().create();

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const { req } = ctx;
  const tokens = await getTokens(req.cookies, authConfig);

  if (!tokens) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }
  return next({ ctx: { user: tokensToUser(tokens.decodedToken) } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
