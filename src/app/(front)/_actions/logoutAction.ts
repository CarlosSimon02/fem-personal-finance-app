"use server";

import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { signOutUseCase } from "@/factories/authClient";
import { removeServerCookies } from "next-firebase-auth-edge/next/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await signOutUseCase.execute();

  removeServerCookies(await cookies(), { cookieName: authConfig.cookieName });
  redirect("/login");
}
