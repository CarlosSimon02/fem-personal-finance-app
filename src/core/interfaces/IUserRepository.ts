import { UserUpdateModel } from "@/data/models/userModel";
import { UserEntity } from "../entities/UserEntity";

export interface IUserRepository {
  createUser(user: UserEntity): Promise<UserEntity>;
  getUserById(uid: string): Promise<UserEntity | null>;
  updateUser(uid: string, updates: UserUpdateModel): Promise<void>;
  deleteUser(uid: string): Promise<void>;
  getAllUsers(): Promise<UserEntity[]>;
}
