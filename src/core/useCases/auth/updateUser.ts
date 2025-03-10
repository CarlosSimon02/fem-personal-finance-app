import { UserUpdateModel } from "@/data/models/userModel";
import { IUserRepository } from "../../interfaces/IUserRepository";

export class UpdateUserProfile {
  constructor(private userRepository: IUserRepository) {}

  async execute(uid: string, updates: UserUpdateModel) {
    return this.userRepository.updateUser(uid, updates);
  }
}
