import { DecodedIdToken } from "firebase-admin/auth";
import { UserDto } from "../schemas/userSchema";

export interface IAuthAdminRepository {
  verifyIdToken(idToken: string): Promise<DecodedIdToken>;
  getUser(uid: string): Promise<UserDto>;
  createUser(email: string, password: string): Promise<UserDto>;
  updateUserDisplayName(uid: string, displayName?: string): Promise<void>;
  deleteUser(uid: string): Promise<void>;
  setCustomUserClaims(uid: string, claims: object): Promise<void>;
}
