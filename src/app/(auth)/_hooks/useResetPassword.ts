"use client";

import { resetPasswordFactory } from "@/factories/auth/resetPasswordFactory";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useResetPassword = () => {
  const resetPassword = resetPasswordFactory();

  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      try {
        await resetPassword.execute(email);
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
