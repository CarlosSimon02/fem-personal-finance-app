export type TransactionCategoryEntity = {
  id: string;
  name: string;
  color: string | null;
};

export type TransactionType = "income" | "expense";

export class TransactionEntity {
  constructor(
    public readonly id: string,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly recipientOrPayer: string | null,
    public readonly category: TransactionCategoryEntity,
    public readonly transactionDate: Date,
    public readonly description: string | null,
    public readonly createdAt: Date | undefined,
    public readonly updatedAt: Date | undefined,
    public readonly userId: string
  ) {}

  static create(
    id: string,
    type: TransactionType,
    amount: number,
    recipientOrPayer: string | null,
    category: TransactionCategoryEntity,
    transactionDate: Date,
    description: string | null,
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
    userId: string
  ): TransactionEntity {
    return new TransactionEntity(
      id,
      type,
      amount,
      recipientOrPayer,
      category,
      transactionDate,
      description,
      createdAt,
      updatedAt,
      userId
    );
  }
}
