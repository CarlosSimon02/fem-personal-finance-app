import { OnboardUser } from "@/core/useCases/auth/onboardUser";
import { VerifyIdToken } from "@/core/useCases/auth/verifyIdToken";
import { AuthAdminDatasource } from "@/data/datasources/authAdminDatasource";
import { UserDatasource } from "@/data/datasources/userDatasource";
import { AuthAdminRepository } from "@/data/repositories/authAdminRepository";
import { UserRepository } from "@/data/repositories/userRespository";

const authAdminDatasource = new AuthAdminDatasource();
const userDatasource = new UserDatasource();

const userRepository = new UserRepository(userDatasource);
const authAdminRepository = new AuthAdminRepository(authAdminDatasource);

export const onboardUserUseCase = new OnboardUser(
  userRepository,
  authAdminRepository
);
export const verifyIdTokenUseCase = new VerifyIdToken(authAdminRepository);

export {
  authAdminDatasource,
  authAdminRepository,
  userDatasource,
  userRepository,
};
