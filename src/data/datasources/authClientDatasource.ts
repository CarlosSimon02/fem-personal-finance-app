import { AuthCredentials, AuthResponse } from "@/data/models/authModel";
import { clientAuth } from "@/services/firebase/firebaseClient";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export class AuthClientDatasource {
  async signUpWithEmail(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        clientAuth,
        credentials.email,
        credentials.password
      );
      const idToken = await userCredential.user.getIdToken();
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        idToken,
        refreshToken: userCredential.user.refreshToken,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to sign up: " + err.message);
    }
  }

  async logInWithEmail(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        clientAuth,
        credentials.email,
        credentials.password
      );
      const idToken = await userCredential.user.getIdToken();
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        idToken,
        refreshToken: userCredential.user.refreshToken,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to log in: " + err.message);
    }
  }

  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(clientAuth, provider);
      const idToken = await userCredential.user.getIdToken();
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        idToken,
        refreshToken: userCredential.user.refreshToken,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to sign in with Google: " + err.message);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(clientAuth, email);
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to reset password: " + err.message);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(clientAuth);
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to sign out: " + err.message);
    }
  }

  async getIdToken(): Promise<string> {
    try {
      const user = clientAuth.currentUser;
      if (!user) throw new Error("No user is signed in.");
      return await user.getIdToken();
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to get ID token: " + err.message);
    }
  }
}
