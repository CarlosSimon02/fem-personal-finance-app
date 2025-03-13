import { IUserRepository } from "@/core/interfaces/IUserRepository";
import { UserUpdateModel } from "@/data/models/userModel";

export class UpdateUserProfile {
  constructor(private userRepository: IUserRepository) {}

  async execute(uid: string, updates: UserUpdateModel) {
    return this.userRepository.updateUser(uid, updates);
  }
}
