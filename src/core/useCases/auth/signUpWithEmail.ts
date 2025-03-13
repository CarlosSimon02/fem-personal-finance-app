import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";
import { AuthCredentials } from "@/data/models/authModel";

export class SignUpWithEmail {
  constructor(private authRepository: IAuthClientRepository) {}

  async execute(credentials: AuthCredentials) {
    return this.authRepository.signUpWithEmail(credentials);
  }
}
