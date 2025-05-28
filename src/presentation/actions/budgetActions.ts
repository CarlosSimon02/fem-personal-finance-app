"use server";

import {
  BudgetDto,
  CreateBudgetDto,
  PaginatedBudgetsResponse,
} from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  createBudgetUseCase,
  getPaginatedBudgetsUseCase,
} from "@/factories/budget";
import { actionWithAuth } from "@/utils/actionWithAuth";

export const createBudgetAction = actionWithAuth<CreateBudgetDto, BudgetDto>(
  async ({ user, data }) => {
    const budget = await createBudgetUseCase.execute(user.id, data);
    return { data: budget, error: null };
  }
);

export const getPaginatedBudgetsAction = actionWithAuth<
  PaginationParams,
  PaginatedBudgetsResponse
>(async ({ user, data }) => {
  const response = await getPaginatedBudgetsUseCase.execute(user.id, data);
  return { data: response, error: null };
});
