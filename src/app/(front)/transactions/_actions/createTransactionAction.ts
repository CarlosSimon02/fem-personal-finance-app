"use server";

import { CreateTransactionInput } from "@/core/schemas/transactionSchema";
import { actionWithAuth } from "@/utils/actionWithAuth";

const createTransactionAction = actionWithAuth<CreateTransactionInput, null>(
  async ({ user, data }) => {
    console.log(user, data, "Test data");
    return { data: null, error: null };
  }
);

// const createTransactionAction = (data: CreateTransactionInput) => {
//   console.log(data, "Test data");
// };

export default createTransactionAction;
