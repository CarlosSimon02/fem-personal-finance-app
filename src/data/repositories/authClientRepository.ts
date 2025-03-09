import { AuthEntity } from "@/core/entities/AuthEntity";
import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";
import { AuthCredentials } from "@/data/models/authModel";
import { AuthClient } from "../datasources/authClient";

export class AuthClientRepository implements IAuthClientRepository {
  private authClient: AuthClient;

  constructor(authClient: AuthClient) {
    this.authClient = authClient;
  }

  async signUpWithEmail(credentials: AuthCredentials): Promise<AuthEntity> {
    return this.authClient.signUpWithEmail(credentials);
  }

  async logInWithEmail(credentials: AuthCredentials): Promise<AuthEntity> {
    return this.authClient.logInWithEmail(credentials);
  }

  async signInWithGoogle(): Promise<AuthEntity> {
    return this.authClient.signInWithGoogle();
  }

  async resetPassword(email: string): Promise<void> {
    return this.authClient.resetPassword(email);
  }

  async signOut(): Promise<void> {
    return this.authClient.signOut();
  }

  async getIdToken(): Promise<string> {
    return this.authClient.getIdToken();
  }
}
