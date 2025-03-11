import { VerifyIdToken } from "@/core/useCases/auth/verifyIdToken";
import { AuthAdminDatasource } from "@/data/datasources/authAdminDatasource";
import { AuthAdminRepository } from "@/data/repositories/authAdminRepository";

export function verifyIdTokenFactory() {
  const authDatasource = new AuthAdminDatasource();
  const authRepository = new AuthAdminRepository(authDatasource);
  return new VerifyIdToken(authRepository);
}
