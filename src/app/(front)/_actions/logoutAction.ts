"use server";

import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { signOutFactory } from "@/factories/auth/signOutFactory";
import { removeServerCookies } from "next-firebase-auth-edge/next/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const signOut = signOutFactory();
  await signOut.execute();

  removeServerCookies(await cookies(), { cookieName: authConfig.cookieName });
  redirect("/login");
}
