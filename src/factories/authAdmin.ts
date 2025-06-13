import { OnboardUser } from "@/core/useCases/auth/onboardUser";
import { VerifyIdToken } from "@/core/useCases/auth/verifyIdToken";
import { AuthAdminRepository } from "@/data/repositories/authAdminRepository";
import { UserRepository } from "@/data/repositories/userRespository";

const userRepository = new UserRepository();
const authAdminRepository = new AuthAdminRepository();

export const onboardUserUseCase = new OnboardUser(
  userRepository,
  authAdminRepository
);
export const verifyIdTokenUseCase = new VerifyIdToken(authAdminRepository);

export { authAdminRepository, userRepository };
