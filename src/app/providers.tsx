"use client";

import { User } from "@/core/schemas/userSchema";
import { AuthProvider } from "@/presentation/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type ProvidersProps = {
  children: React.ReactNode;
  user: User | null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false, // Don't retry auth mutations by default
    },
  },
});

export function Providers({ user, children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider user={user}>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
