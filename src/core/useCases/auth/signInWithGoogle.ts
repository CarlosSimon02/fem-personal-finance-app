import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";

export class SignInWithGoogle {
  constructor(private authRepository: IAuthClientRepository) {}

  async execute() {
    return this.authRepository.signInWithGoogle();
  }
}
