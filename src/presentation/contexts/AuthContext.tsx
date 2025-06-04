import { User } from "@/core/schemas/userSchema";
import { createContext, useContext } from "react";

export interface AuthContextValue {
  user: User | null;
}

type AuthProviderProps = {
  user: User | null;
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
});

export function AuthProvider({ user, children }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
