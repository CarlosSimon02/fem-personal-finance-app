import { UserEntity } from "@/core/entities/UserEntity";
import { IAuthAdminRepository } from "@/core/interfaces/IAuthAdminRepository";
import { IUserRepository } from "@/core/interfaces/IUserRepository";
import { CreateUserDto } from "@/core/schemas/userSchema";

export class OnboardUser {
  constructor(
    private userRepository: IUserRepository,
    private authRepository: IAuthAdminRepository
  ) {}

  async execute(user: CreateUserDto) {
    const existingUser = await this.userRepository.getOneById(user.id);
    if (!!existingUser) return existingUser;

    const validatedUser = new UserEntity(user).validateCreateUser();

    const createdUser = await this.userRepository.createOne(validatedUser);
    await this.authRepository.updateUserDisplayName(
      user.id,
      validatedUser.displayName ?? ""
    );

    return createdUser;
  }
}
