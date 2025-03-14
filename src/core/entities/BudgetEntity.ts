export class BudgetEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly maximumSpending: number,
    public readonly colorTag: string,
    public readonly createdAt: Date | undefined,
    public readonly updatedAt: Date | undefined,
    public readonly userId: string
  ) {}

  static create(
    id: string,
    name: string,
    maximumSpending: number,
    colorTag: string,
    createdAt: Date,
    updatedAt: Date,
    userId: string
  ): BudgetEntity {
    return new BudgetEntity(
      id,
      name,
      maximumSpending,
      colorTag,
      createdAt,
      updatedAt,
      userId
    );
  }
}
