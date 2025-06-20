import { appRouter } from "@/presentation/server";
import { createTRPCContext } from "@/presentation/server/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest, NextResponse } from "next/server";

const handler = (req: NextRequest, res: NextResponse) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
};

export { handler as GET, handler as POST };
