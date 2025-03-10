import {
  authMiddleware,
  redirectToHome,
  redirectToLogin,
} from "next-firebase-auth-edge";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authConfig } from "./config/nextFirebaseAuthEdge";

const AUTH_PATHS = ["/signup", "/login", "/forgot-password"];
const PUBLIC_PATHS = [...AUTH_PATHS];
const PRIVATE_PATHS = ["/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isPrivatePath = PRIVATE_PATHS.includes(pathname);
  const isAuthPath = AUTH_PATHS.includes(pathname);

  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    refreshTokenPath: "/api/refresh-token",
    debug: authConfig.debug,
    enableMultipleCookies: authConfig.enableMultipleCookies,
    enableCustomToken: authConfig.enableCustomToken,
    apiKey: authConfig.apiKey,
    cookieName: authConfig.cookieName,
    cookieSerializeOptions: {
      ...authConfig.cookieSerializeOptions,
      maxAge: 30 * 60 * 60 * 24,
    },
    cookieSignatureKeys: authConfig.cookieSignatureKeys,
    serviceAccount: authConfig.serviceAccount,
    experimental_enableTokenRefreshOnExpiredKidHeader:
      authConfig.experimental_enableTokenRefreshOnExpiredKidHeader,
    handleValidToken: async ({ decodedToken }, headers) => {
      if (isAuthPath && decodedToken) {
        return redirectToHome(request);
      }
      if (isPublicPath || (isPrivatePath && decodedToken)) {
        return NextResponse.next({ request: { headers } });
      }
      if (isPrivatePath && !decodedToken) {
        return redirectToLogin(request, {
          path: "/login",
          publicPaths: PUBLIC_PATHS,
        });
      }
      return NextResponse.next({ request: { headers } });
    },
    handleInvalidToken: async () => {
      if (isPublicPath) return NextResponse.next();
      return redirectToLogin(request, {
        path: "/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
    handleError: async (error) => {
      console.error("Unhandled authentication error", { error });
      return redirectToLogin(request, {
        path: "/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
  });
}

export const config = {
  matcher: [
    "/",
    "/((?!_next|favicon.ico|__/auth|__/firebase|api|.*\.).*)",
    "/api/login",
    "/api/logout",
    "/api/refresh-token",
  ],
};
