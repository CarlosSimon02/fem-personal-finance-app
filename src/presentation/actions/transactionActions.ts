"use server";

import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CreateTransactionDto,
  PaginatedCategoriesResponse,
  PaginatedTransactionsResponse,
  TransactionDto,
} from "@/core/schemas/transactionSchema";
import {
  createTransactionUseCase,
  getPaginatedCategoriesUseCase,
  getPaginatedTransactionsUseCase,
} from "@/factories/transaction";
import { actionWithAuth } from "@/utils/actionWithAuth";

export const getPaginatedTransactionsAction = actionWithAuth<
  PaginationParams,
  PaginatedTransactionsResponse
>(async ({ user, data }) => {
  "use cache";

  const response = await getPaginatedTransactionsUseCase.execute(user.id, data);
  return { data: response, error: null };
});

export const createTransactionAction = actionWithAuth<
  CreateTransactionDto,
  TransactionDto
>(async ({ user, data }) => {
  const transaction = await createTransactionUseCase.execute(user.id, data);
  return { data: transaction, error: null };
});

export const getPaginatedCategoriesAction = actionWithAuth<
  PaginationParams,
  PaginatedCategoriesResponse
>(async ({ user, data }) => {
  const response = await getPaginatedCategoriesUseCase.execute(user.id, data);
  return { data: response, error: null };
});
