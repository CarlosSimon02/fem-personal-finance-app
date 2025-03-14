import { UserEntity } from "@/core/entities/UserEntity";
import { IAuthAdminRepository } from "@/core/interfaces/IAuthAdminRepository";
import { IUserRepository } from "@/core/interfaces/IUserRepository";

export class OnboardUser {
  constructor(
    private userRepository: IUserRepository,
    private authRepository: IAuthAdminRepository
  ) {}

  async execute(user: UserEntity) {
    const existingUser = await this.userRepository.getUserById(user.id);
    if (!!existingUser) return existingUser;
    const createdUser = await this.userRepository.createUser(user);
    await this.authRepository.updateUserDisplayName(user.id, user.displayName);
    return createdUser;
  }
}
