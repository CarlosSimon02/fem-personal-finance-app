import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";

export class SignOut {
  constructor(private authRepository: IAuthClientRepository) {}

  async execute() {
    return this.authRepository.signOut();
  }
}
