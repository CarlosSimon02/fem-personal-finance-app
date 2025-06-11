"use server";

import {
  IncomeDto,
  IncomesSummaryDto,
  PaginatedIncomesResponseDto,
  PaginatedIncomesWithTransactionsResponseDto,
  UpdateIncomeDto,
} from "@/core/schemas/incomeSchema";

import { CreateIncomeDto } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  createIncomeUseCase,
  deleteIncomeUseCase,
  getIncomesSummaryUseCase,
  getPaginatedIncomesUseCase,
  getPaginatedIncomesWithTransactionsUseCase,
  updateIncomeUseCase,
} from "@/factories/income";
import { actionWithAuth } from "@/utils/actionWithAuth";
import { cacheTags } from "@/utils/cacheTags";
import { unstable_cacheTag as cacheTag } from "next/cache";

export const createIncomeAction = actionWithAuth<CreateIncomeDto, IncomeDto>(
  async ({ user, data }) => {
    const income = await createIncomeUseCase.execute(user.id, data);
    return { data: income, error: null };
  }
);

export const deleteIncomeAction = actionWithAuth<string, void>(
  async ({ user, data }) => {
    await deleteIncomeUseCase.execute(user.id, data);
    return { data: undefined, error: null };
  }
);

export const updateIncomeAction = actionWithAuth<
  { id: string; data: UpdateIncomeDto },
  IncomeDto
>(async ({ user, data }) => {
  const income = await updateIncomeUseCase.execute(user.id, data.id, data.data);
  return { data: income, error: null };
});

export const getPaginatedIncomesAction = actionWithAuth<
  PaginationParams,
  PaginatedIncomesResponseDto
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.PAGINATED_INCOMES);

  const response = await getPaginatedIncomesUseCase.execute(user.id, data);
  return { data: response, error: null };
});

export const getPaginatedIncomesWithTransactionsAction = actionWithAuth<
  PaginationParams,
  PaginatedIncomesWithTransactionsResponseDto
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);

  const response = await getPaginatedIncomesWithTransactionsUseCase.execute(
    user.id,
    data
  );
  return { data: response, error: null };
});

export const getIncomesSummaryAction = actionWithAuth<
  number | undefined,
  IncomesSummaryDto
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.INCOMES_SUMMARY);

  const response = await getIncomesSummaryUseCase.execute(user.id, data);
  return { data: response, error: null };
});
