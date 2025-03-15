"use client";

import { SignUpFormData, signUpSchema } from "@/core/schemas/signUpSchema";
import PasswordInput from "@/presentation/components/PasswordInput";
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
import { useForm } from "react-hook-form";
import { useGoogleSignIn } from "../_hooks/useGoogleSignIn";
import { useSignUp } from "../_hooks/useSignUp";
import AuthLayout from "./AuthLayout";
import GoogleSignInButton from "./GoogleSignInButton";

const SignUpForm = () => {
  const signUpMutation = useSignUp();
  const googleSignInMutation = useGoogleSignIn();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    await signUpMutation.mutateAsync(data);
  };

  const handleGoogleSignIn = async () => {
    await googleSignInMutation.mutateAsync();
  };

  const isLoading = signUpMutation.isPending || googleSignInMutation.isPending;
  const isSuccess = signUpMutation.isSuccess || googleSignInMutation.isSuccess;

  return (
    <AuthLayout title="Create your account">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your name"
                      aria-describedby="name-error"
                      disabled={isLoading || isSuccess}
                    />
                  </FormControl>
                  <FormMessage id="name-error" />
                </FormItem>
              )}
            />

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
                      disabled={isLoading || isSuccess}
                    />
                  </FormControl>
                  <FormMessage id="email-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Create a password"
                      aria-describedby="password-error"
                      disabled={isLoading || isSuccess}
                    />
                  </FormControl>
                  <FormMessage id="password-error" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isSuccess}
          >
            {signUpMutation.isPending
              ? "Creating account..."
              : "Create Account"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleSignInButton
            onClick={handleGoogleSignIn}
            label={
              googleSignInMutation.isPending
                ? "Signing up..."
                : "Sign up with Google"
            }
            disabled={isLoading || isSuccess}
          />

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default SignUpForm;
