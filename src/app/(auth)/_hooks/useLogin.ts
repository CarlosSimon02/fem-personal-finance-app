"use client";

import { AuthCredentials } from "@/data/models/authModel";
import { loginWithEmailUseCase } from "@/factories/authClient";
import { useRedirectParam } from "@/presentation/hooks/useRedirectParam";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import postSignInAction from "../_actions/postSignInAction";
export const useLogin = () => {
  const redirect = useRedirectParam();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      try {
        const authEntity = await loginWithEmailUseCase.execute(credentials);
        const response = await postSignInAction(authEntity.idToken);
        if (response.error) throw new Error(response.error);
        return authEntity;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
      router.push(redirect ?? "/");
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });

  return loginMutation;
};
