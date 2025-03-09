import { AuthCredentials } from "@/data/models/authModel";
import { AuthEntity } from "../entities/AuthEntity";

export interface IAuthClientRepository {
  signUpWithEmail(credentials: AuthCredentials): Promise<AuthEntity>;
  logInWithEmail(credentials: AuthCredentials): Promise<AuthEntity>;
  signInWithGoogle(): Promise<AuthEntity>;
  resetPassword(email: string): Promise<void>;
  signOut(): Promise<void>;
  getIdToken(): Promise<string>;
}
