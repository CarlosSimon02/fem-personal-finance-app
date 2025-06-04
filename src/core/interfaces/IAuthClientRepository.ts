import {
  AuthResponseDto,
  LoginWithEmailCredentialsDto,
  SignUpCredentialsDto,
} from "../schemas/authSchema";

export interface IAuthClientRepository {
  signUpWithEmail(credentials: SignUpCredentialsDto): Promise<AuthResponseDto>;
  logInWithEmail(
    credentials: LoginWithEmailCredentialsDto
  ): Promise<AuthResponseDto>;
  signInWithGoogle(): Promise<AuthResponseDto>;
  resetPassword(email: string): Promise<void>;
  signOut(): Promise<void>;
  getIdToken(): Promise<string>;
}
