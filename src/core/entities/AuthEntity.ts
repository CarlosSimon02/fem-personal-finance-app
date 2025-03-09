export class AuthEntity {
  constructor(
    public readonly uid: string,
    public readonly email: string,
    public readonly idToken: string,
    public readonly refreshToken: string
  ) {}
}
