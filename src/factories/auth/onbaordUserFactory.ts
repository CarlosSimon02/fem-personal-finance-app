import { OnboardUser } from "@/core/useCases/auth/onboardUser";
import { AuthAdminDatasource } from "@/data/datasources/authAdminDatasource";
import { UserDatasource } from "@/data/datasources/userDatasource";
import { AuthAdminRepository } from "@/data/repositories/authAdminRepository";
import { UserRepository } from "@/data/repositories/userRespository";

export function onboardUserFactory() {
  const authDatasource = new AuthAdminDatasource();
  const userDatasource = new UserDatasource();
  const authRepository = new AuthAdminRepository(authDatasource);
  const userRepository = new UserRepository(userDatasource);
  return new OnboardUser(userRepository, authRepository);
}
