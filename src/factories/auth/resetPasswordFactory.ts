import { ResetPassword } from "@/core/useCases/auth/resetPassword";
import { AuthClientDatasource } from "@/data/datasources/authClientDatasource";
import { AuthClientRepository } from "@/data/repositories/authClientRepository";

export function resetPasswordFactory() {
  const authDatasource = new AuthClientDatasource();
  const authRepository = new AuthClientRepository(authDatasource);
  return new ResetPassword(authRepository);
}
