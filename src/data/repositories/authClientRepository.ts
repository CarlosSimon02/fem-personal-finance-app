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
import { ErrorHandlingService } from "../services/ErrorHandlingService";

export class AuthClientRepository implements IAuthClientRepository {
  private readonly errorHandlingService: ErrorHandlingService;

  constructor() {
    this.errorHandlingService = new ErrorHandlingService();
  }

  async signUpWithEmail(
    credentials: SignUpCredentialsDto
  ): Promise<AuthResponseDto> {
    return this.errorHandlingService.executeWithErrorHandling(
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
      {
        contextName: "AuthClientRepository",
        operationType: "create",
      },
      "Failed to sign up with email"
    );
  }

  async logInWithEmail(
    credentials: LoginWithEmailCredentialsDto
  ): Promise<AuthResponseDto> {
    return this.errorHandlingService.executeWithErrorHandling(
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
      {
        contextName: "AuthClientRepository",
        operationType: "read",
      },
      "Failed to log in with email"
    );
  }

  async signInWithGoogle(): Promise<AuthResponseDto> {
    return this.errorHandlingService.executeWithErrorHandling(
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
      {
        contextName: "AuthClientRepository",
        operationType: "read",
      },
      "Failed to sign in with Google"
    );
  }

  async resetPassword(email: string): Promise<void> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        await sendPasswordResetEmail(clientAuth, email);
      },
      {
        contextName: "AuthClientRepository",
        operationType: "update",
      },
      "Failed to reset password"
    );
  }

  async signOut(): Promise<void> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        await signOut(clientAuth);
      },
      {
        contextName: "AuthClientRepository",
        operationType: "delete",
      },
      "Failed to sign out"
    );
  }

  async getIdToken(): Promise<string> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const user = clientAuth.currentUser;
        if (!user) throw new Error("No user is signed in.");
        return await user.getIdToken();
      },
      {
        contextName: "AuthClientRepository",
        operationType: "read",
      },
      "Failed to get ID token"
    );
  }
}
