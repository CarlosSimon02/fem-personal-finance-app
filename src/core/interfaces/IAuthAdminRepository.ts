import { UserEntity } from "../entities/UserEntity";

export interface IAuthAdminRepository {
  verifyIdToken(idToken: string): Promise<string>;
  getUser(uid: string): Promise<UserEntity>;
  createUser(email: string, password: string): Promise<UserEntity>;
  updateUserEmail(uid: string, email: string): Promise<void>;
  deleteUser(uid: string): Promise<void>;
  setCustomUserClaims(uid: string, claims: object): Promise<void>;
}
