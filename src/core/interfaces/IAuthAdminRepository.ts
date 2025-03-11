import { DecodedIdToken } from "firebase-admin/auth";
import { UserEntity } from "../entities/UserEntity";

export interface IAuthAdminRepository {
  verifyIdToken(idToken: string): Promise<DecodedIdToken>;
  getUser(uid: string): Promise<UserEntity>;
  createUser(email: string, password: string): Promise<UserEntity>;
  updateUserDisplayName(uid: string, displayName?: string): Promise<void>;
  deleteUser(uid: string): Promise<void>;
  setCustomUserClaims(uid: string, claims: object): Promise<void>;
}
