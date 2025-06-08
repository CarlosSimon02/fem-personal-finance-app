"use server";

import {
  BudgetDto,
  BudgetsSummaryDto,
  CreateBudgetDto,
  PaginatedBudgetsResponseDto,
  PaginatedBudgetsWithTransactionsResponseDto,
} from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  createBudgetUseCase,
  getBudgetsSummaryUseCase,
  getPaginatedBudgetsUseCase,
  getPaginatedBudgetsWithTransactionsUseCase,
} from "@/factories/budget";
import { actionWithAuth } from "@/utils/actionWithAuth";
import { cacheTags } from "@/utils/cacheTags";
import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";

export const createBudgetAction = actionWithAuth<CreateBudgetDto, BudgetDto>(
  async ({ user, data }) => {
    const budget = await createBudgetUseCase.execute(user.id, data);
    revalidateTag(cacheTags.PAGINATED_BUDGETS);
    revalidateTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);
    return { data: budget, error: null };
  }
);

export const getPaginatedBudgetsAction = actionWithAuth<
  PaginationParams,
  PaginatedBudgetsResponseDto
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.PAGINATED_BUDGETS);

  const response = await getPaginatedBudgetsUseCase.execute(user.id, data);
  return { data: response, error: null };
});

export const getPaginatedBudgetsWithTransactionsAction = actionWithAuth<
  PaginationParams,
  PaginatedBudgetsWithTransactionsResponseDto
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);

  const response = await getPaginatedBudgetsWithTransactionsUseCase.execute(
    user.id,
    data
  );
  return { data: response, error: null };
});

export const getBudgetsSummaryAction = actionWithAuth<
  number | undefined,
  BudgetsSummaryDto
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.BUDGETS_SUMMARY);

  const response = await getBudgetsSummaryUseCase.execute(user.id, data);
  return { data: response, error: null };
});

export const revalidateBudgetTags = async () => {
  revalidateTag(cacheTags.PAGINATED_TRANSACTIONS);
  revalidateTag(cacheTags.PAGINATED_CATEGORIES);
  revalidateTag(cacheTags.PAGINATED_BUDGETS);
  revalidateTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);
};
