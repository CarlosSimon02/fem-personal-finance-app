import { IAuthAdminRepository } from "@/core/interfaces/IAuthAdminRepository";
import { UserDto } from "@/core/schemas/userSchema";
import { adminAuth } from "@/services/firebase/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";
import { UserMapper } from "../mappers/UserMapper";
import { ErrorHandlingService } from "../services/ErrorHandlingService";

export class AuthAdminRepository implements IAuthAdminRepository {
  private readonly errorHandlingService: ErrorHandlingService;
  constructor() {
    this.errorHandlingService = new ErrorHandlingService();
  }

  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        return decodedToken;
      },
      {
        contextName: "AuthAdminRepository",
        operationType: "read",
      },
      "Failed to verify ID token"
    );
  }

  async getUser(id: string): Promise<UserDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const userRecord = await adminAuth.getUser(id);
        const userEntity = UserMapper.userRecordToDto(userRecord);
        return userEntity;
      },
      {
        contextName: "AuthAdminRepository",
        operationType: "read",
      },
      "Failed to get user"
    );
  }

  async createUser(email: string, password: string): Promise<UserDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const userRecord = await adminAuth.createUser({ email, password });
        const userEntity = UserMapper.userRecordToDto(userRecord);
        return userEntity;
      },
      {
        contextName: "AuthAdminRepository",
        operationType: "create",
      },
      "Failed to create user"
    );
  }

  async updateUserDisplayName(
    uid: string,
    displayName?: string
  ): Promise<void> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        await adminAuth.updateUser(uid, { displayName });
      },
      {
        contextName: "AuthAdminRepository",
        operationType: "update",
      },
      "Failed to update user display name"
    );
  }

  async deleteUser(uid: string): Promise<void> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        await adminAuth.deleteUser(uid);
      },
      {
        contextName: "AuthAdminRepository",
        operationType: "delete",
      },
      "Failed to delete user"
    );
  }

  async setCustomUserClaims(uid: string, claims: object): Promise<void> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        await adminAuth.setCustomUserClaims(uid, claims);
      },
      {
        contextName: "AuthAdminRepository",
        operationType: "update",
      },
      "Failed to set custom user claims"
    );
  }
}
