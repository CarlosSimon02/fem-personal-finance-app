import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";
import { SignUpCredentialsDto } from "@/core/schemas/authSchema";

export class SignUpWithEmail {
  constructor(private authRepository: IAuthClientRepository) {}

  async execute(credentials: SignUpCredentialsDto) {
    return this.authRepository.signUpWithEmail(credentials);
  }
}
