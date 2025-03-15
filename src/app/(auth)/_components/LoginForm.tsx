"use client";

import { LoginFormData, loginSchema } from "@/core/schemas/loginSchema";
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
import { useLogin } from "../_hooks/useLogin";
import AuthLayout from "./AuthLayout";
import GoogleSignInButton from "./GoogleSignInButton";

const LoginForm = () => {
  const loginMutation = useLogin();
  const googleSignInMutation = useGoogleSignIn();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await loginMutation.mutateAsync(data);
  };

  const handleGoogleSignIn = async () => {
    await googleSignInMutation.mutateAsync();
  };

  const isLoading = loginMutation.isPending || googleSignInMutation.isPending;
  const isSuccess = loginMutation.isSuccess || googleSignInMutation.isSuccess;

  return (
    <AuthLayout title="Sign in to your account">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-primary text-sm font-medium hover:underline"
                      tabIndex={0}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Enter your password"
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
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
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
            label={
              googleSignInMutation.isPending
                ? "Signing in..."
                : "Sign in with Google"
            }
            onClick={handleGoogleSignIn}
            disabled={isLoading || isSuccess}
          />

          <div className="mt-4 text-center text-sm">
            Need to create an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default LoginForm;
