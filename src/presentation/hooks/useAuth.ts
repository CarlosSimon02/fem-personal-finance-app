"use client";

import {
  LoginWithEmailCredentialsDto,
  SignUpCredentialsDto,
} from "@/core/schemas/authSchema";
import {
  loginWithEmailUseCase,
  resetPasswordUseCase,
  signInWithGoogleUseCase,
  signUpWithEmailUseCase,
} from "@/factories/authClient";
import { postSignInAction } from "@/presentation/actions/authActions";
import { useRedirectParam } from "@/presentation/hooks/useRedirectParam";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SignUpData = SignUpCredentialsDto & {
  name: string;
};

export const useGoogleSignIn = () => {
  const redirect = useRedirectParam();
  const router = useRouter();

  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      try {
        const authEntity = await signInWithGoogleUseCase.execute();
        const response = await postSignInAction(authEntity.idToken);
        if (response.error) throw new Error(response.error);
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

export const useLogin = () => {
  const redirect = useRedirectParam();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginWithEmailCredentialsDto) => {
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

export const useResetPassword = () => {
  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      try {
        await resetPasswordUseCase.execute(email);
      } catch (error) {
        console.error("Password reset error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Password reset email sent successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to send reset email: ${error.message}`);
    },
  });

  return resetPasswordMutation;
};

export const useSignUp = () => {
  const redirect = useRedirectParam();
  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpData) => {
      try {
        const { email, password, name } = data;
        const authEntity = await signUpWithEmailUseCase.execute({
          email,
          password,
          name,
        });
        const response = await postSignInAction(authEntity.idToken, { name });
        if (response.error) throw new Error(response.error);
        return authEntity;
      } catch (error) {
        console.error("Sign up error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push(redirect ?? "/");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create account: ${error.message}`);
    },
  });

  return signUpMutation;
};
