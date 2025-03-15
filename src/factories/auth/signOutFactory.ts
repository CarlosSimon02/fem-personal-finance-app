import { SignOut } from "@/core/useCases/auth/signOut";
import { AuthClientDatasource } from "@/data/datasources/authClientDatasource";
import { AuthClientRepository } from "@/data/repositories/authClientRepository";

export function signOutFactory() {
  const authDatasource = new AuthClientDatasource();
  const authRepository = new AuthClientRepository(authDatasource);
  return new SignOut(authRepository);
}
