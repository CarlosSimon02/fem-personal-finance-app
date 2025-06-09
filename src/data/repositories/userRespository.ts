import { IUserRepository } from "@/core/interfaces/IUserRepository";
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
} from "@/core/schemas/userSchema";
import { UserDatasource } from "../datasource/UserDatasource";
import { UserMapper } from "../mappers/UserMapper";
import { CreateUserModel, UpdateUserModel } from "../models/userModel";
import { ErrorHandlingService } from "../services/ErrorHandlingService";
import { FirestoreService } from "../services/FirestoreService";
import { ValidationService } from "../services/ValidationService";

export class UserRepository implements IUserRepository {
  private readonly userDatasource: UserDatasource;
  private readonly firestoreService: FirestoreService;
  private readonly validationService: ValidationService;
  private readonly errorHandlingService: ErrorHandlingService;

  constructor() {
    this.userDatasource = new UserDatasource();
    this.firestoreService = new FirestoreService();
    this.validationService = new ValidationService();
    this.errorHandlingService = new ErrorHandlingService();
  }

  // #########################################################
  // # 🛠️ Helper Methods
  // #########################################################

  private async getAndMapUser(userId: string): Promise<UserDto> {
    const user = await this.userDatasource.getById(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    return UserMapper.toDto(user);
  }

  // #########################################################
  // # 📝 Create One
  // #########################################################

  async createOne(user: CreateUserDto): Promise<UserDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const userData: CreateUserModel = {
          id: user.id,
          createdAt: this.firestoreService.getCurrentTimestamp(),
          updatedAt: this.firestoreService.getCurrentTimestamp(),
          email: user.email,
          displayName: user.displayName ?? null,
          photoURL: user.photoURL ?? null,
          phoneNumber: user.phoneNumber ?? null,
          customClaims: user.customClaims ?? null,
        };

        await this.userDatasource.createOne(userData);

        return this.getAndMapUser(user.id);
      },
      {
        contextName: "UserRepository",
        operationType: "create",
      },
      "Failed to create user"
    );
  }

  // #########################################################
  // # 📝 Read One
  // #########################################################

  async getOneById(id: string): Promise<UserDto | null> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const user = await this.userDatasource.getById(id);
        if (!user) return null;

        return this.getAndMapUser(id);
      },
      {
        contextName: "UserRepository",
        operationType: "read",
      },
      "Failed to get user"
    );
  }

  // #########################################################
  // # 🔄 Update One
  // #########################################################

  private async buildUpdateData(
    currentUser: UserDto,
    input: UpdateUserDto
  ): Promise<UpdateUserModel> {
    const updateData: UpdateUserModel = {
      updatedAt: this.firestoreService.getCurrentTimestamp(),
    };

    if (
      input.displayName !== undefined &&
      input.displayName !== currentUser.displayName
    ) {
      updateData.displayName = input.displayName;
    }

    if (
      input.photoURL !== undefined &&
      input.photoURL !== currentUser.photoURL
    ) {
      updateData.photoURL = input.photoURL;
    }

    if (
      input.phoneNumber !== undefined &&
      input.phoneNumber !== currentUser.phoneNumber
    ) {
      updateData.phoneNumber = input.phoneNumber;
    }

    if (
      input.customClaims !== undefined &&
      input.customClaims !== currentUser.customClaims
    ) {
      updateData.customClaims = input.customClaims;
    }

    return updateData;
  }

  async updateOne(id: string, input: UpdateUserDto): Promise<UserDto> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        const currentUser = await this.getOneById(id);

        if (!currentUser) throw new Error("User not found");

        const updateData = await this.buildUpdateData(currentUser, input);

        await this.userDatasource.updateOne(id, updateData);

        return this.getAndMapUser(id);
      },
      {
        contextName: "UserRepository",
        operationType: "update",
      },
      "Failed to update user"
    );
  }

  // #########################################################
  // # 🗑️ Delete One
  // #########################################################

  async deleteOne(id: string): Promise<void> {
    return this.errorHandlingService.executeWithErrorHandling(
      async () => {
        await this.userDatasource.deleteOne(id);
      },
      {
        contextName: "UserRepository",
        operationType: "delete",
      },
      "Failed to delete user"
    );
  }
}
