"use client";

import { AuthCredentials } from "@/data/models/authModel";
import { signUpWithEmailFactory } from "@/factories/auth/signUpWithEmailFactory";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type SignUpData = AuthCredentials & {
  name: string;
};

export const useSignUp = () => {
  const signUpWithEmail = signUpWithEmailFactory();

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpData) => {
      try {
        const { email, password } = data;
        const authEntity = await signUpWithEmail.execute({
          email,
          password,
        });

        return authEntity;
      } catch (error) {
        console.error("Sign up error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create account: ${error.message}`);
    },
  });

  return signUpMutation;
};
