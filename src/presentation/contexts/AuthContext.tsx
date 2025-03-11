import { UserEntity } from "@/core/entities/UserEntity";
import { createContext, useContext } from "react";

export interface AuthContextValue {
  user: UserEntity | null;
}

type AuthProviderProps = {
  user: UserEntity | null;
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
