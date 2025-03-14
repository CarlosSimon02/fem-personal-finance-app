export class PotEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly target: number | null,
    public readonly theme: string,
    public readonly totalSaved: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly userId: string
  ) {}

  static create(
    id: string,
    name: string,
    target: number | null,
    theme: string,
    totalSaved: number,
    createdAt: Date,
    updatedAt: Date,
    userId: string
  ): PotEntity {
    return new PotEntity(
      id,
      name,
      target,
      theme,
      totalSaved,
      createdAt,
      updatedAt,
      userId
    );
  }
}
