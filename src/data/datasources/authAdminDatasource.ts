// src/services/firebase/auth/authAdmin.ts

import { adminAuth } from "@/services/firebase/firebaseAdmin";
import { DecodedIdToken, UserRecord } from "firebase-admin/auth";

export class AuthAdminDatasource {
  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to verify ID token: " + err.message);
    }
  }

  async getUser(uid: string): Promise<UserRecord> {
    try {
      return await adminAuth.getUser(uid);
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to get user: " + err.message);
    }
  }

  async createUser(email: string, password: string): Promise<UserRecord> {
    try {
      return await adminAuth.createUser({ email, password });
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to create user: " + err.message);
    }
  }

  async updateUserDisplayName(
    uid: string,
    displayName?: string
  ): Promise<void> {
    try {
      await adminAuth.updateUser(uid, { displayName });
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to update user email: " + err.message);
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      await adminAuth.deleteUser(uid);
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to delete user: " + err.message);
    }
  }

  async setCustomUserClaims(uid: string, claims: object): Promise<void> {
    try {
      await adminAuth.setCustomUserClaims(uid, claims);
    } catch (error) {
      const err = error as Error;
      throw new Error("Failed to set custom claims: " + err.message);
    }
  }
}
