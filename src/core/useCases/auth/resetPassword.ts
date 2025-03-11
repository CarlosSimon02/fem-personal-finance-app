import { IAuthClientRepository } from "../../interfaces/IAuthClientRepository";

export class ResetPassword {
  constructor(private authRepository: IAuthClientRepository) {}

  async execute(email: string) {
    return this.authRepository.resetPassword(email);
  }
}
