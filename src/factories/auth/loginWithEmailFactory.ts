import { LogInWithEmail } from "@/core/useCases/auth/logInWithEmail";
import { AuthClientDatasource } from "@/data/datasources/authClientDatasource";
import { AuthClientRepository } from "@/data/repositories/authClientRepository";

export function loginWithEmailFactory() {
  const authDatasource = new AuthClientDatasource();
  const authRepository = new AuthClientRepository(authDatasource);
  return new LogInWithEmail(authRepository);
}
