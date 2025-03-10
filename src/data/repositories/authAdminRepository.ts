import { UserEntity } from "@/core/entities/UserEntity";
import { IAuthAdminRepository } from "@/core/interfaces/IAuthAdminRepository";
import { UserRecord } from "firebase-admin/auth";
import { AuthAdminDataDatasource } from "../datasources/authAdminDatasource";

export class AuthAdminRepository implements IAuthAdminRepository {
  private authAdmin: AuthAdminDataDatasource;

  constructor(authAdmin: AuthAdminDataDatasource) {
    this.authAdmin = authAdmin;
  }

  async verifyIdToken(idToken: string): Promise<string> {
    return this.authAdmin.verifyIdToken(idToken);
  }

  async getUser(uid: string): Promise<UserEntity> {
    const userRecord = await this.authAdmin.getUser(uid);
    const userEntity = this.mapAuthUserRecordToUserEntity(userRecord);
    return userEntity;
  }

  async createUser(email: string, password: string): Promise<UserEntity> {
    const userRecord = await this.authAdmin.createUser(email, password);
    const userEntity = this.mapAuthUserRecordToUserEntity(userRecord);
    return userEntity;
  }

  async updateUserEmail(uid: string, email: string): Promise<void> {
    return this.authAdmin.updateUserEmail(uid, email);
  }

  async deleteUser(uid: string): Promise<void> {
    return this.authAdmin.deleteUser(uid);
  }

  async setCustomUserClaims(uid: string, claims: object): Promise<void> {
    return this.authAdmin.setCustomUserClaims(uid, claims);
  }

  private mapAuthUserRecordToUserEntity(user: UserRecord): UserEntity {
    return {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? undefined,
      photoURL: user.photoURL ?? undefined,
      phoneNumber: user.phoneNumber ?? undefined,
      createdAt: user.metadata.creationTime
        ? new Date(user.metadata.creationTime)
        : undefined,
      updatedAt: user.metadata.lastSignInTime
        ? new Date(user.metadata.lastSignInTime)
        : undefined,
      customClaims: user.customClaims ?? {},
    };
  }
}
