import { CreateUserDto, UpdateUserDto, UserDto } from "../schemas/userSchema";

export interface IUserRepository {
  createUser(user: CreateUserDto): Promise<UserDto>;
  getUserById(uid: string): Promise<UserDto | null>;
  updateUser(uid: string, updates: UpdateUserDto): Promise<UserDto>;
  deleteUser(uid: string): Promise<void>;
}
