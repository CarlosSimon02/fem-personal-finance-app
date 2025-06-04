import { IUserRepository } from "@/core/interfaces/IUserRepository";
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
} from "@/core/schemas/userSchema";
import { UserMapper } from "../mappers/UserMapper";
import {
  CreateUserModel,
  createUserModelSchema,
  UpdateUserModel,
  updateUserModelSchema,
  userModelSchema,
} from "../models/userModel";
import { ValidationService } from "./_services";
import { CollectionService } from "./_services/CollectionService";
import { FirestoreService } from "./_services/FirestoreService";
import { UtilityService } from "./_services/UtilityService";

export class UserRepository implements IUserRepository {
  private readonly collectionService: CollectionService;
  private readonly utilityService: UtilityService;
  private readonly firestoreService: FirestoreService;
  private readonly validationService: ValidationService;
  private readonly contextName = "UserRepository";
  private readonly collectionName = "users";

  constructor() {
    this.collectionService = new CollectionService();
    this.utilityService = new UtilityService();
    this.firestoreService = new FirestoreService();
    this.validationService = new ValidationService();
  }

  private getConfig() {
    return {
      contextName: this.contextName,
      collectionName: this.collectionName,
    };
  }
  async createUser(user: CreateUserDto): Promise<UserDto> {
    return this.utilityService.executeOperation(
      async () => {
        const userData: CreateUserModel = {
          id: user.id,
          createdAt: this.firestoreService.getCurrentTimestamp(),
          updatedAt: this.firestoreService.getCurrentTimestamp(),
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          customClaims: user.customClaims,
        };

        const validatedInput = this.validationService.validateInput(
          createUserModelSchema,
          userData,
          {
            contextName: this.contextName,
            operationType: "create",
          }
        );

        const createdUser = await this.firestoreService.create(
          user.id,
          validatedInput,
          this.getConfig()
        );

        const validatedData = this.validationService.validateDocumentData(
          userModelSchema,
          createdUser,
          {
            contextName: this.contextName,
            operationType: "create",
          }
        );

        return UserMapper.toDto(validatedData);
      },
      this.contextName,
      "Failed to create user"
    );
  }

  async getUserById(id: string): Promise<UserDto | null> {
    return this.utilityService.executeOperation(
      async () => {
        const userModel = await this.collectionService
          .getUserCollection()
          .doc(id)
          .get();
        if (!userModel) return null;

        const validatedData = this.validationService.validateDocumentData(
          userModelSchema,
          userModel,
          {
            contextName: this.contextName,
            operationType: "read",
          }
        );

        return UserMapper.toDto(validatedData);
      },
      this.contextName,
      "Failed to get user"
    );
  }

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

  async updateUser(id: string, input: UpdateUserDto): Promise<UserDto> {
    return this.utilityService.executeOperation(
      async () => {
        const currentUser = await this.getUserById(id);

        if (!currentUser) throw new Error("User not found");

        const updateData = await this.buildUpdateData(currentUser, input);

        const validatedInput = this.validationService.validateInput(
          updateUserModelSchema,
          updateData,
          {
            contextName: this.contextName,
            operationType: "update",
          }
        );

        const updatedUser = await this.collectionService
          .getUserCollection()
          .doc(id)
          .update(validatedInput);

        const validatedData = this.validationService.validateDocumentData(
          userModelSchema,
          updatedUser,
          {
            contextName: this.contextName,
            operationType: "update",
          }
        );

        return UserMapper.toDto(validatedData);
      },
      this.contextName,
      "Failed to update user"
    );
  }

  async deleteUser(id: string): Promise<void> {
    return this.utilityService.executeOperation(
      async () => {
        await this.collectionService.getUserCollection().doc(id).delete();
      },
      this.contextName,
      "Failed to delete user"
    );
  }
}
