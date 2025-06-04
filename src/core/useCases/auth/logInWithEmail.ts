import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";
import { LoginWithEmailCredentialsDto } from "@/core/schemas/authSchema";

export class LogInWithEmail {
  constructor(private authRepository: IAuthClientRepository) {}

  async execute(credentials: LoginWithEmailCredentialsDto) {
    return this.authRepository.logInWithEmail(credentials);
  }
}
