"use client";

import { resetPasswordUseCase } from "@/factories/authClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
