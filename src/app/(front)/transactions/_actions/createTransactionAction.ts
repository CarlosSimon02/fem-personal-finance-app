"use server";

import {
  CreateTransactionDto,
  TransactionDto,
} from "@/core/schemas/transactionSchema";
import { createTransactionUseCase } from "@/factories/transaction";
import { actionWithAuth } from "@/utils/actionWithAuth";

const createTransactionAction = actionWithAuth<
  CreateTransactionDto,
  TransactionDto
>(async ({ user, data }) => {
  const transaction = await createTransactionUseCase.execute(user.id, data);
  return { data: transaction, error: null };
});

export default createTransactionAction;
