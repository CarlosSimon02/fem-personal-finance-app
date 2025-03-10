import { UserEntity } from "../../entities/UserEntity";
import { IUserRepository } from "../../interfaces/IUserRepository";

export class OnboardUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: UserEntity) {
    return this.userRepository.createUser(user);
  }
}
