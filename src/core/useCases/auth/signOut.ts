import { IAuthClientRepository } from "../../interfaces/IAuthClientRepository";

export class SignOut {
  constructor(private authRepository: IAuthClientRepository) {}

  async execute() {
    return this.authRepository.signOut();
  }
}
