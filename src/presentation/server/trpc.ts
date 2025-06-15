import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { tokensToUser } from "@/utils/tokensToUser";
import { initTRPC, TRPCError } from "@trpc/server";
import { getTokens } from "next-firebase-auth-edge";
import { NextRequest } from "next/server";
import { cache } from "react";
import superjson from "superjson";

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export type CreateNextContextOptions = {
  req: Request;
};

export const createTRPCContext = cache(
  async (opts: CreateNextContextOptions) => {
    const nextReq = new NextRequest(opts.req.url, {
      headers: opts.req.headers,
      method: opts.req.method,
      body: opts.req.body,
    });
    return { req: nextReq };
  }
);

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
export const createCallerFactory = t.createCallerFactory;

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
