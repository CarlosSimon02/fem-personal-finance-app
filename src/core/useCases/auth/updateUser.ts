import { IUserRepository } from "@/core/interfaces/IUserRepository";
import { UpdateUserDto } from "@/core/schemas/userSchema";

export class UpdateUserProfile {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, updates: UpdateUserDto) {
    return this.userRepository.updateOne(id, updates);
  }
}
