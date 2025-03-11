import { IAuthAdminRepository } from "@/core/interfaces/IAuthAdminRepository";

export class VerifyIdToken {
  constructor(private authAdminRepository: IAuthAdminRepository) {}

  async execute(idToken: string) {
    return this.authAdminRepository.verifyIdToken(idToken);
  }
}
