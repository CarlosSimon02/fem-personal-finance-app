"use client";

import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/core/schemas/forgotPasswordSchema";
import { Button } from "@/presentation/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/presentation/components/ui/form";
import { Input } from "@/presentation/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useResetPassword } from "../_hooks/useResetPassword";
import AuthLayout from "./AuthLayout";

const ForgotPasswordForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const resetPasswordMutation = useResetPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await resetPasswordMutation.mutateAsync(data.email, {
      onSuccess: () => {
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
      },
    });
  };

  const isLoading = resetPasswordMutation.isPending;

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password."
    >
      {isSubmitted ? (
        <div className="mt-8 text-center">
          <div className="mb-4 inline-block rounded-full bg-green-100 p-3 text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Check your email</h3>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a password reset link to {submittedEmail}
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      aria-describedby="email-error"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage id="email-error" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>

            <div className="mt-4 text-center text-sm">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </Form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordForm;
