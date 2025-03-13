export class BudgetEntity {
  constructor(
    public readonly uid: string,
    public readonly name: string,
    public readonly maximumSpending: number,
    public readonly colorTag: string,
    public readonly createdAt: Date | undefined,
    public readonly updatedAt: Date | undefined,
    public readonly userId: string
  ) {}

  static create(
    uid: string,
    name: string,
    maximumSpending: number,
    colorTag: string,
    createdAt: Date,
    updatedAt: Date,
    userId: string
  ): BudgetEntity {
    return new BudgetEntity(
      uid,
      name,
      maximumSpending,
      colorTag,
      createdAt,
      updatedAt,
      userId
    );
  }
}
