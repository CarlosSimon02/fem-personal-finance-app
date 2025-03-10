import { IAuthClientRepository } from "../../interfaces/IAuthClientRepository";

export class SignInWithGoogle {
  constructor(private authRepository: IAuthClientRepository) {}

  async execute() {
    return this.authRepository.signInWithGoogle();
  }
}
