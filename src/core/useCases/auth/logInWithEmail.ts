import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";
import { AuthCredentials } from "@/data/models/authModel";

export class LogInWithEmail {
  constructor(private authRepository: IAuthClientRepository) {}

  async execute(credentials: AuthCredentials) {
    return this.authRepository.logInWithEmail(credentials);
  }
}
