import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";
import {
  AuthResponseDto,
  LoginWithEmailCredentialsDto,
  SignUpCredentialsDto,
} from "@/core/schemas/authSchema";
import { clientAuth } from "@/services/firebase/firebaseClient";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { UtilityService } from "../services/UtilityService";

export class AuthClientRepository implements IAuthClientRepository {
  private readonly utilityService: UtilityService;
  private readonly contextName = "AuthClientRepository";

  constructor() {
    this.utilityService = new UtilityService();
  }

  async signUpWithEmail(
    credentials: SignUpCredentialsDto
  ): Promise<AuthResponseDto> {
    return this.utilityService.executeOperation(
      async () => {
        const userCredential = await createUserWithEmailAndPassword(
          clientAuth,
          credentials.email,
          credentials.password
        );
        const idToken = await userCredential.user.getIdToken();
        return {
          id: userCredential.user.uid,
          email: userCredential.user.email!,
          idToken,
          refreshToken: userCredential.user.refreshToken,
        };
      },
      this.contextName,
      "Failed to sign up with email"
    );
  }

  async logInWithEmail(
    credentials: LoginWithEmailCredentialsDto
  ): Promise<AuthResponseDto> {
    return this.utilityService.executeOperation(
      async () => {
        const userCredential = await createUserWithEmailAndPassword(
          clientAuth,
          credentials.email,
          credentials.password
        );
        const idToken = await userCredential.user.getIdToken();
        return {
          id: userCredential.user.uid,
          email: userCredential.user.email!,
          idToken,
          refreshToken: userCredential.user.refreshToken,
        };
      },
      this.contextName,
      "Failed to log in with email"
    );
  }

  async signInWithGoogle(): Promise<AuthResponseDto> {
    return this.utilityService.executeOperation(
      async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(clientAuth, provider);
        const idToken = await userCredential.user.getIdToken();
        return {
          id: userCredential.user.uid,
          email: userCredential.user.email!,
          idToken,
          refreshToken: userCredential.user.refreshToken,
        };
      },
      this.contextName,
      "Failed to sign in with Google"
    );
  }

  async resetPassword(email: string): Promise<void> {
    return this.utilityService.executeOperation(
      async () => {
        await sendPasswordResetEmail(clientAuth, email);
      },
      this.contextName,
      "Failed to reset password"
    );
  }

  async signOut(): Promise<void> {
    return this.utilityService.executeOperation(
      async () => {
        await signOut(clientAuth);
      },
      this.contextName,
      "Failed to sign out"
    );
  }

  async getIdToken(): Promise<string> {
    return this.utilityService.executeOperation(
      async () => {
        const user = clientAuth.currentUser;
        if (!user) throw new Error("No user is signed in.");
        return await user.getIdToken();
      },
      this.contextName,
      "Failed to get ID token"
    );
  }
}
