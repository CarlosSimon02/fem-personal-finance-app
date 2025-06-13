"use server";

import { PaginatedCategoriesResponseDto } from "@/core/schemas/categorySchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  CreateTransactionDto,
  PaginatedTransactionsResponseDto,
  TransactionDto,
  UpdateTransactionDto,
} from "@/core/schemas/transactionSchema";
import {
  createTransactionUseCase,
  deleteTransactionUseCase,
  getPaginatedCategoriesUseCase,
  getPaginatedTransactionsUseCase,
  updateTransactionUseCase,
} from "@/factories/transaction";
import { actionWithAuth } from "@/utils/actionWithAuth";
import { cacheTags } from "@/utils/cacheTags";
import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";

export const getPaginatedTransactionsAction = actionWithAuth<
  PaginationParams,
  PaginatedTransactionsResponseDto
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.PAGINATED_TRANSACTIONS);

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
  PaginatedCategoriesResponseDto
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.PAGINATED_CATEGORIES);

  const response = await getPaginatedCategoriesUseCase.execute(user.id, data);
  return { data: response, error: null };
});

export const updateTransactionAction = actionWithAuth<
  { transactionId: string; data: UpdateTransactionDto },
  TransactionDto
>(async ({ user, data }) => {
  const transaction = await updateTransactionUseCase.execute(
    user.id,
    data.transactionId,
    data.data
  );
  return { data: transaction, error: null };
});

export const deleteTransactionAction = actionWithAuth<
  { transactionId: string },
  void
>(async ({ user, data }) => {
  await deleteTransactionUseCase.execute(user.id, data.transactionId);
  return { data: undefined, error: null };
});

export const revalidateTransactionTag = async () => {
  revalidateTag(cacheTags.PAGINATED_TRANSACTIONS);
};

export const revalidateCategoryTag = async () => {
  revalidateTag(cacheTags.PAGINATED_CATEGORIES);
};
