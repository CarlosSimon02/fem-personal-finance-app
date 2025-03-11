"use client";

import { signInWithGoogleFactory } from "@/factories/auth/signInWithGoogleFactory";
import { useRedirectParam } from "@/presentation/hooks/useRedirectParam";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import postSignInAction from "../_actions/postSignInAction";

export const useGoogleSignIn = () => {
  const signInWithGoogle = signInWithGoogleFactory();
  const redirect = useRedirectParam();
  const router = useRouter();

  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      try {
        const authEntity = await signInWithGoogle.execute();
        const response = await postSignInAction(authEntity.idToken);
        if (!response.success) throw new Error(response.error);
        return authEntity;
      } catch (error) {
        console.error("Google sign-in error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Signed in with Google successfully!");
      router.push(redirect ?? "/");
    },
    onError: (error: Error) => {
      toast.error(`Google sign-in failed: ${error.message}`);
    },
  });

  return googleSignInMutation;
};
