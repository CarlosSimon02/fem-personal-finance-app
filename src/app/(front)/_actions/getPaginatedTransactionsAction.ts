"use server";

import { PaginationParams } from "@/core/schemas/paginationSchema";
import { PaginatedTransactionsResponse } from "@/core/schemas/transactionSchema";
import { getPaginatedTransactionsUseCase } from "@/factories/transaction";
import { actionWithAuth } from "@/utils/actionWithAuth";

const getPaginatedTransactionsAction = actionWithAuth<
  PaginationParams,
  PaginatedTransactionsResponse
>(async ({ user, data }) => {
  const response = await getPaginatedTransactionsUseCase.execute(user.id, data);
  return { data: response, error: null };
});

export default getPaginatedTransactionsAction;
