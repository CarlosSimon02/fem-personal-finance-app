import { CreateTransactionDto } from "@/core/schemas/transactionSchema";

export type TransactionDto = {
  id: number;
  name: string;
  quantity: number;
  userId: string;
  isLow: boolean;
};

export type CreateTransactionDto = CreateTransactionDto & {
  userId: string;
};
