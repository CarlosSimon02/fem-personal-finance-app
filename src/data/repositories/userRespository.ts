import { UserEntity } from "@/core/entities/UserEntity";
import { IUserRepository } from "@/core/interfaces/IUserRepository";
import { Timestamp } from "firebase-admin/firestore";
import { UserDatasource } from "../datasources/userDatasource";
import { UserModel, UserUpdateModel } from "../models/userModel";

export class UserRepository implements IUserRepository {
  private datasource: UserDatasource;

  constructor(datasource: UserDatasource) {
    this.datasource = datasource;
  }

  async createUser(user: UserEntity): Promise<UserEntity> {
    const userModel = this.mapUserEntityToModel(user);
    const createdUserModel = await this.datasource.createUser(userModel);
    return this.mapUserModelToEntity(createdUserModel);
  }

  async getUserById(uid: string): Promise<UserEntity | null> {
    const userModel = await this.datasource.getUserById(uid);
    if (!userModel) return null;
    const userEntity = this.mapUserModelToEntity(userModel);
    return userEntity;
  }

  async updateUser(uid: string, updates: UserUpdateModel): Promise<void> {
    return this.datasource.updateUser(uid, updates);
  }

  async deleteUser(uid: string): Promise<void> {
    return this.datasource.deleteUser(uid);
  }

  async getAllUsers(): Promise<UserEntity[]> {
    const userModels = await this.datasource.getAllUsers();
    const userEntity = userModels.map((user) =>
      this.mapUserModelToEntity(user)
    );
    return userEntity;
  }

  private mapUserEntityToModel(user: UserEntity): UserModel {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      phoneNumber: user.phoneNumber ?? null,
      createdAt: user.createdAt ? Timestamp.fromDate(user.createdAt) : null,
      updatedAt: user.updatedAt ? Timestamp.fromDate(user.updatedAt) : null,
      customClaims: user.customClaims ?? null,
    };
  }

  private mapUserModelToEntity(user: UserModel): UserEntity {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ?? undefined,
      photoURL: user.photoURL ?? undefined,
      phoneNumber: user.phoneNumber ?? undefined,
      createdAt: user.createdAt ? user.createdAt.toDate() : undefined,
      updatedAt: user.updatedAt ? user.updatedAt.toDate() : undefined,
      customClaims: user.customClaims ?? undefined,
    };
  }
}
