"use client";

import { signInWithGoogleFactory } from "@/factories/auth/signInWithGoogleFactory";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGoogleSignIn = () => {
  const signInWithGoogle = signInWithGoogleFactory();
  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      try {
        return await signInWithGoogle.execute();
      } catch (error) {
        console.error("Google sign-in error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Signed in with Google successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Google sign-in failed: ${error.message}`);
    },
  });

  return googleSignInMutation;
};
