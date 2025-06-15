"use client";

import { User } from "@/core/schemas/userSchema";
import { AuthProvider } from "@/presentation/contexts/AuthContext";
import { TrpcProvider } from "@/presentation/contexts/TrpcContext";

type ProvidersProps = {
  children: React.ReactNode;
  user: User | null;
};

export function Providers({ user, children }: ProvidersProps) {
  return (
    <AuthProvider user={user}>
      <TrpcProvider>{children}</TrpcProvider>
    </AuthProvider>
  );
}
