import { UserEntity } from "@/core/entities/UserEntity";
import { IAuthAdminRepository } from "@/core/interfaces/IAuthAdminRepository";
import { DecodedIdToken, UserRecord } from "firebase-admin/auth";
import { AuthAdminDatasource } from "../datasources/authAdminDatasource";

export class AuthAdminRepository implements IAuthAdminRepository {
  private authAdmin: AuthAdminDatasource;

  constructor(authAdmin: AuthAdminDatasource) {
    this.authAdmin = authAdmin;
  }

  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
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

  async updateUserDisplayName(
    uid: string,
    displayName?: string
  ): Promise<void> {
    return this.authAdmin.updateUserDisplayName(uid, displayName);
  }

  async deleteUser(uid: string): Promise<void> {
    return this.authAdmin.deleteUser(uid);
  }

  async setCustomUserClaims(uid: string, claims: object): Promise<void> {
    return this.authAdmin.setCustomUserClaims(uid, claims);
  }

  private mapAuthUserRecordToUserEntity(user: UserRecord): UserEntity {
    return {
      id: user.uid,
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
