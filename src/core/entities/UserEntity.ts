export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly displayName?: string,
    public readonly photoURL?: string,
    public readonly phoneNumber?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly customClaims?: Record<string, unknown>
  ) {}
}
