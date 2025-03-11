"use client";

import { AuthCredentials } from "@/data/models/authModel";
import { loginWithEmailFactory } from "@/factories/auth/loginWithEmailFactory";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogin = () => {
  const logInWithEmail = loginWithEmailFactory();

  const loginMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      try {
        return await logInWithEmail.execute(credentials);
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });

  return loginMutation;
};
