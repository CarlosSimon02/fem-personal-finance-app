import { IAuthAdminRepository } from "@/core/interfaces/IAuthAdminRepository";
import { UserDto } from "@/core/schemas/userSchema";
import { adminAuth } from "@/services/firebase/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";
import { UserMapper } from "../mappers/UserMapper";
import { UtilityService } from "./_services/UtilityService";

export class AuthAdminRepository implements IAuthAdminRepository {
  private readonly utilityService: UtilityService;
  private readonly contextName = "AuthAdminRepository";
  constructor() {
    this.utilityService = new UtilityService();
  }

  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    return this.utilityService.executeOperation(
      async () => {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        return decodedToken;
      },
      this.contextName,
      "Failed to verify ID token"
    );
  }

  async getUser(id: string): Promise<UserDto> {
    return this.utilityService.executeOperation(
      async () => {
        const userRecord = await adminAuth.getUser(id);
        const userEntity = UserMapper.userRecordToDto(userRecord);
        return userEntity;
      },
      this.contextName,
      "Failed to get user"
    );
  }

  async createUser(email: string, password: string): Promise<UserDto> {
    return this.utilityService.executeOperation(
      async () => {
        const userRecord = await adminAuth.createUser({ email, password });
        const userEntity = UserMapper.userRecordToDto(userRecord);
        return userEntity;
      },
      this.contextName,
      "Failed to create user"
    );
  }

  async updateUserDisplayName(
    uid: string,
    displayName?: string
  ): Promise<void> {
    return this.utilityService.executeOperation(
      async () => {
        await adminAuth.updateUser(uid, { displayName });
      },
      this.contextName,
      "Failed to update user display name"
    );
  }

  async deleteUser(uid: string): Promise<void> {
    return this.utilityService.executeOperation(
      async () => {
        await adminAuth.deleteUser(uid);
      },
      this.contextName,
      "Failed to delete user"
    );
  }

  async setCustomUserClaims(uid: string, claims: object): Promise<void> {
    return this.utilityService.executeOperation(
      async () => {
        await adminAuth.setCustomUserClaims(uid, claims);
      },
      this.contextName,
      "Failed to set custom user claims"
    );
  }
}
