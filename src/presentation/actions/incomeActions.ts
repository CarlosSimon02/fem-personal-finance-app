"use server";

import {
  IncomeDto,
  PaginatedIncomesResponse,
  PaginatedIncomesWithTransactionsResponse,
} from "@/core/schemas/incomeSchema";

import { CreateIncomeDto } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  createIncomeUseCase,
  getPaginatedIncomesUseCase,
  getPaginatedIncomesWithTransactionsUseCase,
} from "@/factories/income";
import { actionWithAuth } from "@/utils/actionWithAuth";
import { cacheTags } from "@/utils/cacheTags";
import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";

export const createIncomeAction = actionWithAuth<CreateIncomeDto, IncomeDto>(
  async ({ user, data }) => {
    const income = await createIncomeUseCase.execute(user.id, data);
    revalidateTag(cacheTags.PAGINATED_INCOMES);
    revalidateTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);
    return { data: income, error: null };
  }
);

export const getPaginatedIncomesAction = actionWithAuth<
  PaginationParams,
  PaginatedIncomesResponse
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.PAGINATED_INCOMES);

  const response = await getPaginatedIncomesUseCase.execute(user.id, data);
  return { data: response, error: null };
});

export const getPaginatedIncomesWithTransactionsAction = actionWithAuth<
  PaginationParams,
  PaginatedIncomesWithTransactionsResponse
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);

  const response = await getPaginatedIncomesWithTransactionsUseCase.execute(
    user.id,
    data
  );
  return { data: response, error: null };
});
