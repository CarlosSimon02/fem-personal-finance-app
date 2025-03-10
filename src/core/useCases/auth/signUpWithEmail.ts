import { AuthCredentials } from "@/data/models/authModel";
import { IAuthClientRepository } from "../../interfaces/IAuthClientRepository";

export class SignUpWithEmail {
  constructor(private authRepository: IAuthClientRepository) {}

  async execute(credentials: AuthCredentials) {
    return this.authRepository.signUpWithEmail(credentials);
  }
}
