import { SignInWithGoogle } from "@/core/useCases/auth/signInWithGoogle";
import { AuthClientDatasource } from "@/data/datasources/authClientDatasource";
import { AuthClientRepository } from "@/data/repositories/authClientRepository";

export function signInWithGoogleFactory() {
  const authDatasource = new AuthClientDatasource();
  const authRepository = new AuthClientRepository(authDatasource);
  return new SignInWithGoogle(authRepository);
}
