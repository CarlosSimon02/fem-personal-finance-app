import { SignUpWithEmail } from "@/core/useCases/auth/signUpWithEmail";
import { AuthClientDatasource } from "@/data/datasources/authClientDatasource";
import { AuthClientRepository } from "@/data/repositories/authClientRepository";

export function signUpWithEmailFactory() {
  const authDatasource = new AuthClientDatasource();
  const authRepository = new AuthClientRepository(authDatasource);
  return new SignUpWithEmail(authRepository);
}
