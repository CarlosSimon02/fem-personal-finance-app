"use server";

import { CreateTransactionDto } from "@/core/schemas/transactionSchema";
import { createTransactionUseCase } from "@/factories/transaction";
import { actionWithAuth } from "@/utils/actionWithAuth";

const createTransactionAction = actionWithAuth<CreateTransactionDto, null>(
  async ({ user, data }) => {
    console.log(user, data, "Test data");
    const transaction = await createTransactionUseCase.execute(data);
    return { data: null, error: null };
  }
);

export default createTransactionAction;
