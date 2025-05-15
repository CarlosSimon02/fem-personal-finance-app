import { LogInWithEmail } from "@/core/useCases/auth/logInWithEmail";
import { ResetPassword } from "@/core/useCases/auth/resetPassword";
import { SignInWithGoogle } from "@/core/useCases/auth/signInWithGoogle";
import { SignOut } from "@/core/useCases/auth/signOut";
import { SignUpWithEmail } from "@/core/useCases/auth/signUpWithEmail";
import { AuthClientDatasource } from "@/data/datasources/authClientDatasource";
import { AuthClientRepository } from "@/data/repositories/authClientRepository";

const authClientDatasource = new AuthClientDatasource();
const authClientRepository = new AuthClientRepository(authClientDatasource);

export const loginWithEmailUseCase = new LogInWithEmail(authClientRepository);

export const resetPasswordUseCase = new ResetPassword(authClientRepository);
export const signInWithGoogleUseCase = new SignInWithGoogle(
  authClientRepository
);
export const signOutUseCase = new SignOut(authClientRepository);
export const signUpWithEmailUseCase = new SignUpWithEmail(authClientRepository);

export { authClientDatasource, authClientRepository };
